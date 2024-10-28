import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { pool } from '../../../utils/db';
import { userSchema } from '../../../utils/validate';
import { generateToken } from '../../../utils/auth';
import { sendVerificationEmail } from '../../../utils/email';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const hashedPassword = await bcrypt.hash(value.password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [value.email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken({ userId: user.id }, '1h');
    await sendVerificationEmail(user.email, token);
    res.status(201).json({ message: 'User registered, verify email' });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
}
