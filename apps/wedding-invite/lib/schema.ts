import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  message: text("message").notNull(),
  password: varchar("password", { length: 4 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// 응답으로 내보내도 되는 컬럼 (password 제외)
export const publicGuestbookColumns = {
  id: guestbook.id,
  name: guestbook.name,
  message: guestbook.message,
  createdAt: guestbook.createdAt,
}

export type GuestbookEntry = typeof guestbook.$inferSelect
export type PublicGuestbookEntry = Omit<GuestbookEntry, "password">
export type NewGuestbookEntry = typeof guestbook.$inferInsert
