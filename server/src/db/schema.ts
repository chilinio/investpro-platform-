import { pgTable, serial, text, varchar, integer, decimal, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const investmentPackages = pgTable('investment_packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  minimumInvestment: decimal('minimum_investment', { precision: 10, scale: 2 }).notNull(),
  dailyInterestRate: decimal('daily_interest_rate', { precision: 5, scale: 2 }).notNull(),
  duration: integer('duration').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const investments = pgTable('investments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  packageId: integer('package_id').notNull().references(() => investmentPackages.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  startDate: timestamp('start_date', { withTimezone: true }).defaultNow(),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  investmentId: integer('investment_id').references(() => investments.id),
  type: varchar('type', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  investments: many(investments),
  transactions: many(transactions)
}))

export const investmentPackagesRelations = relations(investmentPackages, ({ many }) => ({
  investments: many(investments)
}))

export const investmentsRelations = relations(investments, ({ one, many }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.id]
  }),
  package: one(investmentPackages, {
    fields: [investments.packageId],
    references: [investmentPackages.id]
  }),
  transactions: many(transactions)
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  }),
  investment: one(investments, {
    fields: [transactions.investmentId],
    references: [investments.id]
  })
})) 