'use client'

import { createContext, useState } from 'react'

import { type BoardState, createBoardStore } from '@/stores/board-store'

type BoardStoreApi = ReturnType<typeof createBoardStore>

export const BoardStoreContext = createContext<BoardStoreApi | undefined>(
  undefined,
)

type BoardStoreProviderProps = {
  initialData: BoardState
  children: React.ReactNode
}

export function BoardStoreProvider({
  initialData,
  children,
}: BoardStoreProviderProps) {
  const [store] = useState(() => createBoardStore(initialData))

  return (
    <BoardStoreContext.Provider value={store}>
      {children}
    </BoardStoreContext.Provider>
  )
}
