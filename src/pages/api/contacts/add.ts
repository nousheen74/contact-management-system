import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../utils/db';
import { contactSchema } from '../../../utils/validate';
import { getCurrentUTCTime } from '../../../utils/date';

export default async function addContact(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { error, value } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const createdAt = getCurrentUTCTime();

  try {
    const result = await pool.query(
      'INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.body.userId, value.name, value.email, value.phone, value.address, value.timezone, createdAt]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add contact' });
  }
}
