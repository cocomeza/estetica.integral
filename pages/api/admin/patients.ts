import type { NextApiRequest, NextApiResponse } from 'next'
import { getPatientsForAdmin } from '../../../src/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // La autenticación se maneja en el middleware

  try {
    const patients = await getPatientsForAdmin()

    return res.status(200).json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return res.status(500).json({ error: 'Error al obtener pacientes' })
  }
}