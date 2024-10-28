import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../utils/db';
import { verifyToken } from '../../../utils/auth';

export default async function verifyEmail(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  try {
    const decoded: any = verifyToken(token as string);
    await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [decoded.userId]);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}
