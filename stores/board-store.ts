import { createStore } from 'zustand'

import type { Column, Task } from '@/db/schema'

export type BoardState = {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  taskOrderByColumn: Record<string, string[]>
  columnOrder: string[]
}

export type BoardActions = {
  setColumnOrder: (columnOrder: string[]) => void
  setTaskOrderByColumn: (taskOrderByColumn: Record<string, string[]>) => void
}

export type BoardStore = BoardState & BoardActions

export const defaultInitState: BoardState = {
  tasks: {},
  columns: {},
  taskOrderByColumn: {},
  columnOrder: [],
}

export function createBoardStore(initState: BoardState = defaultInitState) {
  return createStore<BoardStore>()((set) => ({
    ...initState,

    setColumnOrder: (columnOrder) => set({ columnOrder }),
    setTaskOrderByColumn: (taskOrderByColumn) => set({ taskOrderByColumn }),
  }))
}
