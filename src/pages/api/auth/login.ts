import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { pool } from '../../../utils/db';
import { generateToken } from '../../../utils/auth';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email' });
    }

    const token = generateToken({ userId: user.id }, '2h');
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}
