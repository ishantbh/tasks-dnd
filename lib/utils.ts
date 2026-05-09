import type { Column, Task } from '@/db/schema'

// Convert the board data from db to a normalized format for client state
export function normalizeBoardData({
  columns: dbColumns,
  tasks: dbTasks,
}: {
  columns: Column[]
  tasks: Task[]
}) {
  const tasks: Record<string, Task> = {}
  const columns: Record<string, Column> = {}
  const taskOrderByColumn: Record<string, string[]> = {}
  const columnOrder: string[] = []

  for (const column of dbColumns) {
    columns[column.id] = column

    taskOrderByColumn[column.id] = []

    columnOrder.push(column.id)
  }

  for (const task of dbTasks) {
    tasks[task.id] = task

    taskOrderByColumn[task.columnId].push(task.id)
  }

  return {
    tasks,
    columns,
    taskOrderByColumn,
    columnOrder,
  }
}
