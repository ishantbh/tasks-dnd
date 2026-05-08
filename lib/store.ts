import { create } from 'zustand'

import type { ColumnType, TaskType } from '@/lib/types'
import { initialData } from '@/lib/data'

type BoardState = {
  tasks: Record<string, TaskType>
  columns: Record<string, ColumnType>
  columnOrder: string[]

  reorderColumns: ({
    columnId,
    sourceIndex,
    destinationIndex,
  }: {
    columnId: string
    sourceIndex: number
    destinationIndex: number
  }) => void

  reorderTasks: ({
    taskId,
    columnId,
    sourceIndex,
    destinationIndex,
  }: {
    taskId: string
    columnId: string
    sourceIndex: number
    destinationIndex: number
  }) => void

  moveTask: ({
    taskId,
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex,
  }: {
    taskId: string
    sourceColumnId: string
    destinationColumnId: string
    sourceIndex: number
    destinationIndex: number
  }) => void
}

export const useBoard = create<BoardState>()((set) => ({
  ...initialData,

  reorderColumns: ({ columnId, sourceIndex, destinationIndex }) =>
    set(({ columnOrder }) => {
      const newColumnOrder = [...columnOrder]
      newColumnOrder.splice(sourceIndex, 1)
      newColumnOrder.splice(destinationIndex, 0, columnId)

      return { columnOrder: newColumnOrder }
    }),

  reorderTasks: ({ taskId, columnId, sourceIndex, destinationIndex }) =>
    set(({ columns }) => {
      const col = columns[columnId]
      const newTaskIds = [...col.taskIds]
      newTaskIds.splice(sourceIndex, 1)
      newTaskIds.splice(destinationIndex, 0, taskId)

      const newCol = { ...col, taskIds: newTaskIds }

      return { columns: { ...columns, [newCol.id]: newCol } }
    }),

  moveTask: ({
    taskId,
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex,
  }) =>
    set(({ columns }) => {
      const sourceColumn = columns[sourceColumnId]
      const destinationColumn = columns[destinationColumnId]

      const sourceTaskIds = [...sourceColumn.taskIds]
      sourceTaskIds.splice(sourceIndex, 1)
      const newSourceColumn = { ...sourceColumn, taskIds: sourceTaskIds }

      const destinationTaskIds = [...destinationColumn.taskIds]
      destinationTaskIds.splice(destinationIndex, 0, taskId)
      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: destinationTaskIds,
      }

      return {
        columns: {
          ...columns,
          [sourceColumn.id]: newSourceColumn,
          [destinationColumn.id]: newDestinationColumn,
        },
      }
    }),
}))
