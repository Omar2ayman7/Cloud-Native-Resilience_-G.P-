import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { createToken } from '../utils/jwt.js';
import { HttpError } from '../utils/httpError.js';

export async function signup(req, res) {
  const { name, email, password, rePassword, phone } = req.body || {};
  if (!name || !email || !password || !rePassword || !phone) {
    throw new HttpError(400, 'All fields are required');
  }
  if (password !== rePassword) throw new HttpError(400, 'Passwords do not match');

  const normalizedEmail = String(email).trim().toLowerCase();
  const { data: existing, error: lookupError } = await supabase
    .from('users').select('id').eq('email', normalizedEmail).maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) throw new HttpError(409, 'Account already exists');

  const passwordHash = await bcrypt.hash(password, 12);
  const { data: user, error } = await supabase.from('users').insert({
    name: String(name).trim(), email: normalizedEmail, password_hash: passwordHash, phone: String(phone).trim()
  }).select('id,name,email,phone,created_at').single();
  if (error) throw error;

  res.status(201).json({ message: 'success', user });
}

export async function signin(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) throw new HttpError(400, 'Email and password are required');

  const normalizedEmail = String(email).trim().toLowerCase();
  const { data: user, error } = await supabase.from('users').select('*').eq('email', normalizedEmail).maybeSingle();
  if (error) throw error;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, 'Incorrect email or password');
  }

  res.json({
    message: 'success',
    token: createToken(user.id),
    user: { name: user.name, email: user.email, role: 'user' }
  });
}
