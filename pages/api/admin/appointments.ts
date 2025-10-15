import type { NextApiRequest, NextApiResponse } from 'next'
import { getAppointmentsForAdmin } from '../../../src/lib/supabase-admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  // La autenticación se maneja en el middleware

  try {
    const {
      page = '1',
      search = '',
      status = 'all',
      specialistId = '',
      startDate = '',
      endDate = '',
      limit = '10'
    } = req.query

    const appointments = await getAppointmentsForAdmin({
      search: search as string,
      status: status as string,
      specialistId: specialistId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    })

    return res.status(200).json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return res.status(500).json({ error: 'Error al obtener citas' })
  }
}