import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../utils/db';
import { contactSchema } from '../../../utils/validate';
import { getCurrentUTCTime } from '../../../utils/date';

export default async function updateContact(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { error, value } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updatedAt = getCurrentUTCTime();

  try {
    const result = await pool.query(
      'UPDATE contacts SET name = $1, email = $2, phone = $3, address = $4, timezone = $5, updated_at = $6 WHERE id = $7 AND is_deleted = FALSE RETURNING *',
      [value.name, value.email, value.phone, value.address, value.timezone, updatedAt, req.body.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
}
