import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, text, numeric, date, timestamp, uuid } from 'drizzle-orm/pg-core'
import { Pool } from 'pg'

export const policies = pgTable('policies', {
  id: uuid('id').defaultRandom().primaryKey(),
  policyNumber: text('policy_number').notNull(),
  cedant: text('cedant').notNull(),
  broker: text('broker').notNull(),
  premium: numeric('premium', { precision: 14, scale: 2 }).notNull(),
  sumInsured: numeric('sum_insured', { precision: 14, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  occupancy: text('occupancy').notNull(),
  market: text('market').notNull(),
  inceptionDate: date('inception_date').notNull(),
  expiryDate: date('expiry_date').notNull(),
  status: text('status').notNull(),
  premiumStatus: text('premium_status').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema: { policies } })
