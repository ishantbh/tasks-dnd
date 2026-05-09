import { db } from '@/db'
import { columnTable, NewTask, taskTable } from '@/db/schema'

async function main() {
  try {
    const [{ id: columnId }] = await db
      .insert(columnTable)
      .values({
        title: 'To Do',
        position: 1000,
      })
      .returning()

    const dummyTasks: NewTask[] = [
      { content: 'Take out the garbage', position: 1000, columnId },
      { content: 'Watch my favorite show', position: 2000, columnId },
      { content: 'Charge my phone', position: 3000, columnId },
      { content: 'Cook dinner', position: 4000, columnId },
    ]

    await db.insert(taskTable).values(dummyTasks)

    console.log('Seeded successfully!')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
