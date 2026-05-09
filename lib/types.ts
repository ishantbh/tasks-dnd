import type { Column, Task } from '@/db/schema'

export type BoardType = {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  taskOrderByColumn: Record<string, string[]>
  columnOrder: string[]
}
