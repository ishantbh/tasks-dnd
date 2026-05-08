'use client'

import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'

import { useBoard } from '@/lib/store'

import Column from '@/components/column'

export default function Board() {
  const columnOrder = useBoard((state) => state.columnOrder)
  const reorderColumns = useBoard((state) => state.reorderColumns)
  const reorderTasks = useBoard((state) => state.reorderTasks)
  const moveTask = useBoard((state) => state.moveTask)

  function handleDragEnd(result: DropResult<string>) {
    const { draggableId, source, destination, type } = result

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return
    }

    if (type === 'column') {
      reorderColumns({
        columnId: draggableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })

      return
    }

    // Reorder items in the same column
    if (destination.droppableId === source.droppableId) {
      reorderTasks({
        taskId: draggableId,
        columnId: source.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })

      return
    }

    // Moving items between columns
    moveTask({
      taskId: draggableId,
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
