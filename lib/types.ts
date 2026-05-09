export type BoardType = {
  tasks: Record<string, TaskType>
  columns: Record<string, ColumnType>
  taskOrderByColumn: Record<string, string[]>
  columnOrder: string[]
}

export type ColumnType = {
  id: string
  title: string
}

export type TaskType = {
  id: string
  content: string
}
