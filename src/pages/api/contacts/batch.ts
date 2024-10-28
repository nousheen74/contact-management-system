import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../utils/db';
import { contactSchema } from '../../../utils/validate';
import { getCurrentUTCTime } from '../../../utils/date';

export default async function batchContacts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const contacts = req.body.contacts;

  try {
    for (const contact of contacts) {
      const { error } = contactSchema.validate(contact);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const createdAt = getCurrentUTCTime();

      await pool.query(
        'INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [req.body.userId, contact.name, contact.email, contact.phone, contact.address, contact.timezone, createdAt]
      );
    }

    res.status(201).json({ message: 'Contacts added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process batch contacts' });
  }
}
