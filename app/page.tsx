import Link from 'next/link'

import { desc } from 'drizzle-orm'

import { db } from '@/db'
import { boardTable } from '@/db/schema'

import CreateBoard from '@/components/create-board'

export default async function Home() {
  const boards = await db
    .select()
    .from(boardTable)
    .orderBy(desc(boardTable.createdAt))

  return (
    <>
      <ul className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {boards.map((board) => (
          <li key={board.id}>
            <Link
              href={`/boards/${board.id}`}
              className='block border border-foreground/15 rounded-lg p-4 hover:bg-foreground/5'
            >
              {board.title}
            </Link>
          </li>
        ))}
        <li>
          <CreateBoard />
        </li>
      </ul>
    </>
  )
}
