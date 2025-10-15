import type { NextApiRequest, NextApiResponse } from 'next'
import { setAdminSession } from '../../../src/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    // Buscar admin en la base de datos
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Crear sesión
    const sessionCookie = await setAdminSession(email)
    
    res.setHeader('Set-Cookie', sessionCookie)
    res.status(200).json({ success: true, user: { email: admin.email, role: admin.role } })
  } catch (error) {
    console.error('Error in admin login:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
