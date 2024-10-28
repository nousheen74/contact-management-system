import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import xlsx from 'xlsx';
import { pool } from '../../../utils/db';
import { getCurrentUTCTime } from '../../../utils/date';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = upload.single('file');

export default async function uploadContacts(req: NextApiRequest, res: NextApiResponse) {
  uploadHandler(req, res, async (err) => {
    if (err) return res.status(500).json({ error: 'Failed to upload file' });

    const workbook = xlsx.read(req.file.buffer);
    const contacts: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    try {
      for (const contact of contacts) {
        const createdAt = getCurrentUTCTime();
        await pool.query(
          'INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [req.body.userId, contact.name, contact.email, contact.phone, contact.address, contact.timezone, createdAt]
        );
      }

      res.status(201).json({ message: 'Contacts uploaded successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process contacts' });
    }
  });
}
