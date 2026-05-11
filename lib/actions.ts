'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { boardTable, columnTable, taskTable } from '@/db/schema'

export async function updateColumnPosition({
  id,
  position,
}: {
  id: string
  position: string
}) {
  await db.update(columnTable).set({ position }).where(eq(columnTable.id, id))
}

export async function updateTaskPosition({
  id,
  position,
  columnId,
}: {
  id: string
  position: string
  columnId?: string
}) {
  await db
    .update(taskTable)
    .set({ position, ...(columnId && { columnId }) })
    .where(eq(taskTable.id, id))
}

export async function createBoard(title: string) {
  await db.insert(boardTable).values({ title })

  revalidatePath('/boards')
}

export async function createColumn({
  boardId,
  position,
  title,
}: {
  boardId: string
  position: string
  title: string
}) {
  await db.insert(columnTable).values({ boardId, position, title })

  revalidatePath(`/boards/${boardId}`)
}
