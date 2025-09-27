import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

// Create audit logs table
const createAuditTable = async () => {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(255) NOT NULL,
        resource VARCHAR(255),
        resource_id INTEGER,
        ip_address INET,
        user_agent TEXT,
        request_data JSONB,
        response_status INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('Audit logs table ready');
  } catch (error) {
    console.error('Error creating audit logs table:', error);
  }
};

// Initialize table on module load
createAuditTable();

interface AuditLogData {
  userId?: number;
  action: string;
  resource?: string;
  resourceId?: number;
  requestData?: any;
  responseStatus?: number;
}

// Log audit event
export const logAuditEvent = async (
  req: Request,
  data: AuditLogData
) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    await db.execute(sql`
      INSERT INTO audit_logs (
        user_id, action, resource, resource_id, 
        ip_address, user_agent, request_data, response_status
      ) VALUES (
        ${data.userId || null},
        ${data.action},
        ${data.resource || null},
        ${data.resourceId || null},
        ${ipAddress},
        ${userAgent},
        ${JSON.stringify(data.requestData) || null},
        ${data.responseStatus || null}
      )
    `);
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
};

// Middleware to automatically log certain actions
export const auditMiddleware = (action: string, resource?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the audit event
      logAuditEvent(req, {
        userId: (req.session as any)?.userId,
        action,
        resource,
        resourceId: req.params.id ? parseInt(req.params.id) : undefined,
        requestData: {
          method: req.method,
          path: req.path,
          query: req.query,
          body: sanitizeRequestBody(req.body)
        },
        responseStatus: res.statusCode
      });

      return originalSend.call(this, data);
    };

    next();
  };
};

// Sanitize request body to remove sensitive data
const sanitizeRequestBody = (body: any) => {
  if (!body) return null;
  
  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'pin'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Get audit logs for admin
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const userId = req.query.userId as string;
    const action = req.query.action as string;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params: any[] = [];
    
    if (userId) {
      whereConditions.push(`user_id = $${params.length + 1}`);
      params.push(parseInt(userId));
    }
    
    if (action) {
      whereConditions.push(`action = $${params.length + 1}`);
      params.push(action);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const logsResult = await db.execute(sql`
      SELECT 
        al.*,
        u.first_name,
        u.last_name,
        u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${sql.raw(whereClause)}
      ORDER BY al.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Get total count
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM audit_logs ${sql.raw(whereClause)}
    `);
    const total = Number((totalResult.rows[0] as any).count);

    res.json({
      logs: logsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

// Specific audit log functions for common actions
export const auditLogin = (req: Request, userId: number, success: boolean) => {
  logAuditEvent(req, {
    userId: success ? userId : undefined,
    action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
    resource: 'auth',
    requestData: { email: req.body.email },
    responseStatus: success ? 200 : 401
  });
};

export const auditLogout = (req: Request, userId: number) => {
  logAuditEvent(req, {
    userId,
    action: 'LOGOUT',
    resource: 'auth',
    responseStatus: 200
  });
};

export const auditRegistration = (req: Request, userId: number) => {
  logAuditEvent(req, {
    userId,
    action: 'REGISTER',
    resource: 'auth',
    requestData: { 
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    },
    responseStatus: 201
  });
};

export const auditInvestmentCreated = (req: Request, userId: number, investmentId: number) => {
  logAuditEvent(req, {
    userId,
    action: 'INVESTMENT_CREATED',
    resource: 'investments',
    resourceId: investmentId,
    requestData: {
      packageId: req.body.packageId,
      amount: req.body.amount
    },
    responseStatus: 201
  });
};

export const auditPaymentDeposit = (req: Request, userId: number, amount: number) => {
  logAuditEvent(req, {
    userId,
    action: 'PAYMENT_DEPOSIT',
    resource: 'payments',
    requestData: {
      amount,
      paymentMethod: req.body.paymentMethod
    },
    responseStatus: 200
  });
};

export const auditPaymentWithdrawal = (req: Request, userId: number, amount: number) => {
  logAuditEvent(req, {
    userId,
    action: 'PAYMENT_WITHDRAWAL',
    resource: 'payments',
    requestData: {
      amount,
      withdrawalMethod: req.body.withdrawalMethod
    },
    responseStatus: 200
  });
};
