import { useShallow } from 'zustand/shallow'
import { DropResult } from '@hello-pangea/dnd'

import { useBoardStore } from '@/hooks/useBoardStore'
import { updateColumnPosition, updateTaskPosition } from '@/lib/actions'
import { getPosition } from '@/lib/utils'

export function useBoardDrag() {
  const {
    tasks,
    columns,
    columnOrder,
    taskOrderByColumn,
    setColumnOrder,
    setTaskOrderByColumn,
  } = useBoardStore(
    useShallow((state) => ({
      tasks: state.tasks,
      columns: state.columns,
      columnOrder: state.columnOrder,
      taskOrderByColumn: state.taskOrderByColumn,
      setTaskOrderByColumn: state.setTaskOrderByColumn,
      setColumnOrder: state.setColumnOrder,
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
      const newColumnOrder = [...columnOrder]
      const [movedColumnId] = newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, movedColumnId)

      setColumnOrder(newColumnOrder)

      const prev = columns[newColumnOrder[destination.index - 1]]?.position
      const next = columns[newColumnOrder[destination.index + 1]]?.position
      const newPosition = getPosition(prev, next)

      await updateColumnPosition({ id: movedColumnId, position: newPosition })

      return
    }

    // Reorder items in the same column
    if (destination.droppableId === source.droppableId) {
      const newTaskIds = [...taskOrderByColumn[source.droppableId]]
      const [movedTaskId] = newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, movedTaskId)

      setTaskOrderByColumn({
        ...taskOrderByColumn,
        [source.droppableId]: newTaskIds,
      })

      const prev = tasks[newTaskIds[destination.index - 1]]?.position
      const next = tasks[newTaskIds[destination.index + 1]]?.position
      const newPosition = getPosition(prev, next)

      await updateTaskPosition({ id: movedTaskId, position: newPosition })

      return
    }

    // Moving items between columns
    const sourceTaskIds = [...taskOrderByColumn[source.droppableId]]
    const [movedTaskId] = sourceTaskIds.splice(source.index, 1)

    const destinationTaskIds = [...taskOrderByColumn[destination.droppableId]]
    destinationTaskIds.splice(destination.index, 0, movedTaskId)

    setTaskOrderByColumn({
      ...taskOrderByColumn,
      [source.droppableId]: sourceTaskIds,
      [destination.droppableId]: destinationTaskIds,
    })

    const prev = tasks[sourceTaskIds[destination.index - 1]]?.position
    const next = tasks[sourceTaskIds[destination.index + 1]]?.position
    const newPosition = getPosition(prev, next)

    await updateTaskPosition({
      id: movedTaskId,
      position: newPosition,
      columnId: destination.droppableId,
    })
  }

  return { handleDragEnd }
}
