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

function getPosition(prev?: number, next?: number): number {
  if (!prev && !next) return 1000
  if (!prev) return next! / 2
  if (!next) return prev + 1000
  return (prev + next) / 2
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
  const newPosition = getPosition(prev, next)

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
  const newPosition = getPosition(prev, next)

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
  const newPosition = getPosition(prev, next)

  return {
    sourceTaskIds,
    destinationTaskIds,
    movedTaskId,
    newPosition,
  }
}
