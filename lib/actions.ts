'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { columnTable, taskTable } from '@/db/schema'

export async function updateColumnPosition({
  id,
  position,
}: {
  id: string
  position: number
}) {
  await db.update(columnTable).set({ position }).where(eq(columnTable.id, id))
}

export async function updateTaskPosition({
  id,
  position,
  columnId,
}: {
  id: string
  position: number
  columnId?: string
}) {
  await db
    .update(taskTable)
    .set({ position, ...(columnId && { columnId }) })
    .where(eq(taskTable.id, id))
}
