import { connectDatabase } from '@/lib/mongodb';

export async function addTemplate(templateData) {
  const db = await connectDatabase();
  const templates = db.collection('templates');
  await templates.insertOne(templateData);
}
