import { generateKeyBetween } from 'fractional-indexing'

import type { Column, Task } from '@/db/schema'

type ColumnWithTasks = Column & { tasks: Task[] }

// Convert the board data from db to a normalized format for client state
export function normalizeBoardData(columnsWithTasks: ColumnWithTasks[]) {
  const tasks: Record<string, Task> = {}
  const columns: Record<string, Column> = {}
  const taskOrderByColumn: Record<string, string[]> = {}
  const columnOrder: string[] = []

  for (const column of columnsWithTasks) {
    columns[column.id] = column
    columnOrder.push(column.id)
    taskOrderByColumn[column.id] = column.tasks.map((t) => t.id)
    for (const task of column.tasks) {
      tasks[task.id] = task
    }
  }

  return {
    tasks,
    columns,
    taskOrderByColumn,
    columnOrder,
  }
}

export function computeColumnReorder({
  columns,
  columnOrder,
  sourceIndex,
  destinationIndex,
}: {
  columns: Record<string, Column>
  columnOrder: string[]
  sourceIndex: number
  destinationIndex: number
}) {
  const newColumnOrder = [...columnOrder]
  const [movedColumnId] = newColumnOrder.splice(sourceIndex, 1)
  newColumnOrder.splice(destinationIndex, 0, movedColumnId)

  const prev = columns[newColumnOrder[destinationIndex - 1]]?.position
  const next = columns[newColumnOrder[destinationIndex + 1]]?.position
  const newPosition = generateKeyBetween(prev, next)

  return { newColumnOrder, movedColumnId, newPosition }
}

export function computeTaskReorder({
  tasks,
  taskOrder,
  columnId,
  sourceIndex,
  destinationIndex,
}: {
  tasks: Record<string, Task>
  taskOrder: Record<string, string[]>
  columnId: string
  sourceIndex: number
  destinationIndex: number
}) {
  const newTaskIds = [...taskOrder[columnId]]
  const [movedTaskId] = newTaskIds.splice(sourceIndex, 1)
  newTaskIds.splice(destinationIndex, 0, movedTaskId)

  const prev = tasks[newTaskIds[destinationIndex - 1]]?.position
  const next = tasks[newTaskIds[destinationIndex + 1]]?.position
  const newPosition = generateKeyBetween(prev, next)

  return { newTaskIds, movedTaskId, newPosition }
}

export function computeTaskMove({
  tasks,
  taskOrder,
  sourceColumnId,
  sourceIndex,
  destinationColumnId,
  destinationIndex,
}: {
  tasks: Record<string, Task>
  taskOrder: Record<string, string[]>
  sourceColumnId: string
  sourceIndex: number
  destinationColumnId: string
  destinationIndex: number
}) {
  const sourceTaskIds = [...taskOrder[sourceColumnId]]
  const [movedTaskId] = sourceTaskIds.splice(sourceIndex, 1)

  const destinationTaskIds = [...taskOrder[destinationColumnId]]
  destinationTaskIds.splice(destinationIndex, 0, movedTaskId)

  const prev = tasks[sourceTaskIds[destinationIndex - 1]]?.position
  const next = tasks[sourceTaskIds[destinationIndex + 1]]?.position
  const newPosition = generateKeyBetween(prev, next)

  return {
    sourceTaskIds,
    destinationTaskIds,
    movedTaskId,
    newPosition,
  }
}
