import express, { Request, Response } from 'express';
import { db } from '../db';
import { contacts } from '../db/schema';
import { desc } from 'drizzle-orm';

const router = express.Router();

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Simple validation function
const validateContactForm = (data: any): data is ContactFormData => {
  return (
    typeof data.name === 'string' && data.name.trim().length > 0 &&
    typeof data.email === 'string' && data.email.includes('@') &&
    typeof data.message === 'string' && data.message.trim().length > 0
  );
};

// Submit contact form
router.post('/submit', async (req: Request<{}, {}, ContactFormData>, res: Response) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!validateContactForm(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid name, email, and message.'
      });
    }

    // Insert contact submission into database
    const [contact] = await db.insert(contacts).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.',
      data: { id: contact.id }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.'
    });
  }
});

// Get all contact submissions (admin only)
router.get('/submissions', async (req: Request, res: Response) => {
  try {
    const submissions = await db.query.contacts.findMany({
      orderBy: desc(contacts.createdAt)
    });

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions'
    });
  }
});

// Get all contact messages (admin only) - alias for backwards compatibility
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const messages = await db.query.contacts.findMany({
      orderBy: desc(contacts.createdAt)
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;