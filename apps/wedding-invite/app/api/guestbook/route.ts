import { db } from "@/lib/db"
import { guestbook } from "@/lib/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  const entries = await db.select().from(guestbook).orderBy(desc(guestbook.createdAt))
  return Response.json(entries)
}

export async function POST(req: Request) {
  const { name, message, password } = await req.json()
  if (!name?.trim() || !message?.trim() || !/^\d{4}$/.test(password)) {
    return Response.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 })
  }
  const [entry] = await db
    .insert(guestbook)
    .values({ name: name.trim(), message: message.trim(), password })
    .returning()
  return Response.json(entry, { status: 201 })
}
