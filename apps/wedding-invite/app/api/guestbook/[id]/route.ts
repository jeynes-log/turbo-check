import { db } from "@/lib/db"
import { guestbook } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { password } = await req.json()

  const [entry] = await db
    .select()
    .from(guestbook)
    .where(eq(guestbook.id, Number(id)))

  if (!entry) return Response.json({ error: "존재하지 않는 글입니다." }, { status: 404 })
  if (entry.password !== password)
    return Response.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 })

  await db.delete(guestbook).where(eq(guestbook.id, Number(id)))

  return new Response(null, { status: 204 })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, message, password } = await req.json()

  if (!name?.trim() || !message?.trim()) {
    return Response.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 })
  }

  const [entry] = await db
    .select()
    .from(guestbook)
    .where(eq(guestbook.id, Number(id)))

  if (!entry) return Response.json({ error: "존재하지 않는 글입니다." }, { status: 404 })
  if (entry.password !== password)
    return Response.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 })

  const [updated] = await db
    .update(guestbook)
    .set({ name: name.trim(), message: message.trim() })
    .where(eq(guestbook.id, Number(id)))
    .returning()

  return Response.json(updated)
}
