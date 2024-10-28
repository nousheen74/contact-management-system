import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../utils/db';
import { sendVerificationEmail } from '../../../utils/email';
import { generateToken } from '../../../utils/auth';

export default async function resetPassword(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = generateToken({ userId: user.id }, '15m');
    await sendVerificationEmail(user.email, token);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
}
