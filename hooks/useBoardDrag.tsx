import { useShallow } from 'zustand/shallow'
import type { DropResult } from '@hello-pangea/dnd'

import { useBoardStore } from '@/hooks/useBoardStore'

export function useBoardDrag() {
  const { reorderColumns, reorderTasks, moveTask } = useBoardStore(
    useShallow((state) => ({
      columns: state.columns,
      columnOrder: state.columnOrder,
      setColumnOrder: state.setColumnOrder,
      reorderColumns: state.reorderColumns,
      reorderTasks: state.reorderTasks,
      moveTask: state.moveTask,
    })),
  )

  async function handleDragEnd(result: DropResult) {
    const { source, destination, type } = result

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return
    }

    if (type === 'column') {
      reorderColumns({
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })

      return
    }

    // Reorder items in the same column
    if (destination.droppableId === source.droppableId) {
      reorderTasks({
        columnId: source.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })

      return
    }

    // Moving items between columns
    moveTask({
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    })
  }

  return { handleDragEnd }
}
