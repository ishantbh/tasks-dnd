import { useShallow } from 'zustand/shallow'
import { DropResult } from '@hello-pangea/dnd'

import { useBoardStore } from '@/hooks/useBoardStore'
import { updateColumnPosition, updateTaskPosition } from '@/lib/actions'
import {
  computeColumnReorder,
  computeTaskMove,
  computeTaskReorder,
} from '@/lib/utils'

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
      const { newColumnOrder, movedColumnId, newPosition } =
        computeColumnReorder({
          columns,
          columnOrder,
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })

      const previousColumnOrder = columnOrder // snapshot before

      setColumnOrder(newColumnOrder) // optimistic update

      try {
        await updateColumnPosition({ id: movedColumnId, position: newPosition })
      } catch (err) {
        console.log(err)
        setColumnOrder(previousColumnOrder) // rollback
        // TODO: notify user of error
      }

      return
    }

    // Reorder items in the same column
    if (destination.droppableId === source.droppableId) {
      const { newTaskIds, movedTaskId, newPosition } = computeTaskReorder({
        tasks,
        taskOrder: taskOrderByColumn,
        columnId: source.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })

      const previousTaskOrder = taskOrderByColumn // snapshot before

      setTaskOrderByColumn({
        ...taskOrderByColumn,
        [source.droppableId]: newTaskIds,
      })

      try {
        await updateTaskPosition({ id: movedTaskId, position: newPosition })
      } catch (err) {
        console.log(err)
        setTaskOrderByColumn(previousTaskOrder) // rollback
        // TODO: notify user of error
      }

      return
    }

    // Moving items between columns
    const { sourceTaskIds, destinationTaskIds, movedTaskId, newPosition } =
      computeTaskMove({
        tasks,
        taskOrder: taskOrderByColumn,
        sourceColumnId: source.droppableId,
        sourceIndex: source.index,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      })

    const previousTaskOrder = taskOrderByColumn // snapshot before

    setTaskOrderByColumn({
      ...taskOrderByColumn,
      [source.droppableId]: sourceTaskIds,
      [destination.droppableId]: destinationTaskIds,
    })

    try {
      await updateTaskPosition({
        id: movedTaskId,
        position: newPosition,
        columnId: destination.droppableId,
      })
    } catch (err) {
      console.log(err)
      setTaskOrderByColumn(previousTaskOrder) // rollback
      // TODO: notify user of error
    }
  }

  return { handleDragEnd }
}
