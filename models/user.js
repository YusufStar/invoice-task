import { connectDatabase } from '@/lib/mongodb';

export async function addUser(userData) {
  const db = await connectDatabase();
  const users = db.collection('users');
  await users.insertOne(userData);
}

export async function getUserByEmail(email) {
  const db = await connectDatabase();
  const users = db.collection('users');
  return await users.findOne({ email });
}
