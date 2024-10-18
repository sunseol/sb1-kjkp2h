import { getSession } from 'next-auth/react';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.query;

  if (session.user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { db } = await connectToDatabase();

  try {
    const projects = await db.collection('projects').find({ userId }).toArray();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
