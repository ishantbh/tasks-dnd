import { db } from '@/db'
import { columnTable, NewColumn, NewTask, taskTable } from '@/db/schema'

async function main() {
  try {
    const dummyColumns: NewColumn[] = [
      { title: 'To Do', position: 'a0' },
      { title: 'In Progress', position: 'a1' },
      { title: 'Done', position: 'a2' },
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
