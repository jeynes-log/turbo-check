import { db } from "@/lib/db"
import { guestbook } from "@/lib/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  const entries = await db.select().from(guestbook).orderBy(desc(guestbook.createdAt))
  return Response.json(entries)
}

export async function POST(req: Request) {
  const { name, message } = await req.json()
  if (!name?.trim() || !message?.trim()) {
    return Response.json({ error: "이름과 메시지를 입력해 주세요." }, { status: 400 })
  }
  const [entry] = await db
    .insert(guestbook)
    .values({ name: name.trim(), message: message.trim() })
    .returning()
  return Response.json(entry, { status: 201 })
}
