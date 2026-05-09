import { create } from 'zustand'

import type { Column, Task } from '@/db/schema'
import type { BoardType } from '@/lib/types'

type BoardState = {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  taskOrderByColumn: Record<string, string[]>
  columnOrder: string[]

  hydrate: (data: BoardType) => void

  reorderColumns: ({
    sourceIndex,
    destinationIndex,
  }: {
    sourceIndex: number
    destinationIndex: number
  }) => void

  reorderTasks: ({
    columnId,
    sourceIndex,
    destinationIndex,
  }: {
    columnId: string
    sourceIndex: number
    destinationIndex: number
  }) => void

  moveTask: ({
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex,
  }: {
    sourceColumnId: string
    destinationColumnId: string
    sourceIndex: number
    destinationIndex: number
  }) => void
}

export const useBoard = create<BoardState>()((set) => ({
  tasks: {},
  columns: {},
  taskOrderByColumn: {},
  columnOrder: [],

  hydrate: (data) => set(() => ({ ...data })),

  reorderColumns: ({ sourceIndex, destinationIndex }) =>
    set(({ columnOrder }) => {
      const newColumnOrder = [...columnOrder]
      const [movedColumnId] = newColumnOrder.splice(sourceIndex, 1)
      newColumnOrder.splice(destinationIndex, 0, movedColumnId)

      return { columnOrder: newColumnOrder }
    }),

  reorderTasks: ({ columnId, sourceIndex, destinationIndex }) =>
    set(({ taskOrderByColumn }) => {
      const newTaskIds = [...taskOrderByColumn[columnId]]
      const [movedTaskId] = newTaskIds.splice(sourceIndex, 1)
      newTaskIds.splice(destinationIndex, 0, movedTaskId)

      return {
        taskOrderByColumn: { ...taskOrderByColumn, [columnId]: newTaskIds },
      }
    }),

  moveTask: ({
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex,
  }) =>
    set(({ taskOrderByColumn }) => {
      const sourceTaskIds = [...taskOrderByColumn[sourceColumnId]]
      const [movedTaskId] = sourceTaskIds.splice(sourceIndex, 1)

      const destinationTaskIds = [...taskOrderByColumn[destinationColumnId]]
      destinationTaskIds.splice(destinationIndex, 0, movedTaskId)

      return {
        taskOrderByColumn: {
          ...taskOrderByColumn,
          [sourceColumnId]: sourceTaskIds,
          [destinationColumnId]: destinationTaskIds,
        },
      }
    }),
}))
