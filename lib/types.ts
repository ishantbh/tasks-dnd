export type BoardType = {
  tasks: Record<string, TaskType>
  columns: Record<string, ColumnType>
  columnOrder: string[]
}

export type ColumnType = {
  id: string
  title: string
  taskIds: string[]
}

export type TaskType = {
  id: string
  content: string
}
