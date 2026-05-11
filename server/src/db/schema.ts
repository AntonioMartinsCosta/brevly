import { sql } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    originalUrl: text('original_url').notNull(),
    shortUrl: text('short_url').notNull().unique(),
    accessCount: integer('access_count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    shortUrlIdx: index('links_short_url_idx').on(table.shortUrl),
    createdAtIdx: index('links_created_at_idx').on(table.createdAt),
  }),
)

export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert
