'use client'

import { useShallow } from 'zustand/shallow'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'

import Column from '@/components/column'
import { useBoardStore } from '@/hooks/useBoardStore'

export default function Board() {
  const { columnOrder, reorderColumns, reorderTasks, moveTask } = useBoardStore(
    useShallow((state) => ({
      columnOrder: state.columnOrder,
      reorderColumns: state.reorderColumns,
      reorderTasks: state.reorderTasks,
      moveTask: state.moveTask,
    })),
  )

  const handleDragEnd = async function (result: DropResult<string>) {
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {({ droppableProps, innerRef, placeholder }) => (
          <div {...droppableProps} ref={innerRef} className='flex-1 flex'>
            {columnOrder.map((columnId, index) => {
              return <Column key={columnId} columnId={columnId} index={index} />
            })}
            {placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
