import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../utils/db';

export default async function getContacts(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId; // Assuming userId is passed as a query parameter

  try {
    const result = await pool.query(
      'SELECT * FROM contacts WHERE user_id = $1 AND is_deleted = FALSE',
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve contacts' });
  }
}
