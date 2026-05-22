import { db } from "@/lib/db"
import { guestbook } from "@/lib/schema"
import { guestbookEntrySchema } from "@/lib/guestbook-schema"
import { count, desc } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10) || 5))

  const [[{ value: total }], items] = await Promise.all([
    db.select({ value: count() }).from(guestbook),
    db
      .select()
      .from(guestbook)
      .orderBy(desc(guestbook.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return Response.json({ items, total, page, pageSize, totalPages })
}

export async function POST(req: Request) {
  const parsed = guestbookEntrySchema.safeParse(await req.json())

  if (!parsed.success) {
    return Response.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 })
  }

  const { name, message, password } = parsed.data

  const [entry] = await db.insert(guestbook).values({ name, message, password }).returning()

  return Response.json(entry, { status: 201 })
}
