import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { columnTable, taskTable } from '@/db/schema'
import { normalizeBoardData } from '@/lib/utils'
import { BoardStoreProvider } from '@/providers/board-store-provider'

import Board from '@/components/board'

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: boardId } = await params

  const columnsWithTasks = await db.query.columnTable.findMany({
    where: eq(columnTable.boardId, boardId),
    orderBy: columnTable.position,
    with: {
      tasks: {
        orderBy: taskTable.position,
      },
    },
  })

  const initialData = normalizeBoardData(columnsWithTasks)

  return (
    <BoardStoreProvider initialData={initialData}>
      <Board />
    </BoardStoreProvider>
  )
}
