import { NextApiRequest, NextApiResponse } from 'next';
import { getPayload } from 'payload';
import config from '@/payload.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = await getPayload({ config });

  try {
    switch (req.method) {
      case 'GET':
        // Handle GET request to fetch tools
        const tools = await payload.find({
          collection: 'tools',
        });
        res.status(200).json(tools);
        break;

      case 'POST':
        // Handle POST request to create a new tool
        const tool = await payload.create({
          collection: 'tools',
          data: req.body,
        });
        res.status(201).json(tool);
        break;

        case 'PATCH':
          // Handle PATCH request to update a tool
          const { id, ...updateData } = req.body; // Extract the tool ID and update data from the request body
          if (!id) {
            return res.status(400).json({ error: 'Tool ID is required' });
          }
        
          try {
            const updatedTool = await payload.update({
              collection: 'tools',
              where: {
                id: {
                  equals: id, // Use the `equals` operator to match the tool by ID
                },
              },
              data: updateData,
            });
            res.status(200).json(updatedTool);
          } catch (error) {
            console.error('Error updating tool:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
          break;

      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}