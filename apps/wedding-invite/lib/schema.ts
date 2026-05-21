import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  message: text("message").notNull(),
  password: varchar("password", { length: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type GuestbookEntry = typeof guestbook.$inferSelect
export type NewGuestbookEntry = typeof guestbook.$inferInsert
