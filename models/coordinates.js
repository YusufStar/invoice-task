import { connectDatabase } from '@/lib/mongodb';

export async function addCoordinates(coordinatesData) {
    const db = await connectDatabase();
    const coordinates = db.collection('coordinates');
    await coordinates.insertOne(coordinatesData);
}