import { db } from '@/db'
import { columnTable, taskTable } from '@/db/schema'
import { normalizeBoardData } from '@/lib/utils'
import { BoardStoreProvider } from '@/providers/board-store-provider'

import Board from '@/components/board'

export default async function Home() {
  const [columns, tasks] = await Promise.all([
    db.select().from(columnTable).orderBy(columnTable.position),
    db.select().from(taskTable).orderBy(taskTable.position),
  ])

  const initialData = normalizeBoardData({ columns, tasks })

  return (
    <main className='flex-1 flex'>
      <div className='flex-1 flex flex-col container p-4 w-full mx-auto gap-4 space-y-4'>
        <h1 className='text-xl sm:text-2xl font-semibold'>Kanban App</h1>
        <BoardStoreProvider initialData={initialData}>
          <Board />
        </BoardStoreProvider>
      </div>
    </main>
  )
}
