import { useContext } from 'react'

import { useStore } from 'zustand'

import type { BoardStore } from '@/stores/board-store'
import { BoardStoreContext } from '@/providers/board-store-provider'

export function useBoardStore<T>(selector: (store: BoardStore) => T): T {
  const boardStoreContext = useContext(BoardStoreContext)
  if (!boardStoreContext) {
    throw new Error('useBoardStore must be used within a BoardStoreProvider')
  }

  return useStore(boardStoreContext, selector)
}
