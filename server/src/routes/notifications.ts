import { Router } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Create notifications table if it doesn't exist
const createNotificationsTable = async () => {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info' NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('Notifications table ready');
  } catch (error) {
    console.error('Error creating notifications table:', error);
  }
};

// Initialize table on module load
createNotificationsTable();

// Get user notifications
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const notifications = await db.execute(sql`
      SELECT * FROM notifications 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Get total count
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ${userId}
    `);
    const total = Number((totalResult.rows[0] as any).count);

    // Get unread count
    const unreadResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ${userId} AND read = false
    `);
    const unreadCount = Number((unreadResult.rows[0] as any).count);

    res.json({
      notifications: notifications.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.session.userId!;

    await db.execute(sql`
      UPDATE notifications 
      SET read = true, updated_at = NOW() 
      WHERE id = ${notificationId} AND user_id = ${userId}
    `);

    res.json({ success: true });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    await db.execute(sql`
      UPDATE notifications 
      SET read = true, updated_at = NOW() 
      WHERE user_id = ${userId} AND read = false
    `);

    res.json({ success: true });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Create notification (internal function for other routes to use)
export const createNotification = async (
  userId: number, 
  title: string, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  try {
    await db.execute(sql`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (${userId}, ${title}, ${message}, ${type})
    `);
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

// Delete notification
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.session.userId!;

    await db.execute(sql`
      DELETE FROM notifications 
      WHERE id = ${notificationId} AND user_id = ${userId}
    `);

    res.json({ success: true });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
