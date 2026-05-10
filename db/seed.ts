import { db } from '@/db'
import type { NewBoard, NewColumn, NewTask } from '@/db/schema'
import { boardTable, columnTable, taskTable } from '@/db/schema'

async function main() {
  try {
    const dummyBoards: NewBoard[] = [
      { title: 'My Kanban Board' },
      { title: 'Another Board' },
      { title: 'Yet Another Board' },
    ]

    const insertedBoards = await db
      .insert(boardTable)
      .values(dummyBoards)
      .returning()

    const dummyColumns: NewColumn[] = [
      { title: 'To Do', position: 'a0', boardId: insertedBoards[0].id },
      { title: 'In Progress', position: 'a1', boardId: insertedBoards[0].id },
      { title: 'Done', position: 'a2', boardId: insertedBoards[0].id },

      { title: 'Backlog', position: 'a0', boardId: insertedBoards[1].id },
      { title: 'Doing', position: 'a1', boardId: insertedBoards[1].id },
      { title: 'Finished', position: 'a2', boardId: insertedBoards[1].id },
    ]

    const insertedColumns = await db
      .insert(columnTable)
      .values(dummyColumns)
      .returning()

    const dummyTasks: NewTask[] = [
      {
        content: 'Take out the garbage',
        columnId: insertedColumns[0].id,
        position: 'a0',
      },
      {
        content: 'Watch my favorite show',
        columnId: insertedColumns[0].id,
        position: 'a1',
      },
      {
        content: 'Charge my phone',
        columnId: insertedColumns[0].id,
        position: 'a2',
      },
      {
        content: 'Cook dinner',
        columnId: insertedColumns[0].id,
        position: 'a3',
      },
    ]

    await db.insert(taskTable).values(dummyTasks)

    console.log('Seeded successfully!')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
