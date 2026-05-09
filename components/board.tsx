'use client'

import { useEffect } from 'react'

import { useShallow } from 'zustand/shallow'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'

import type { BoardType } from '@/lib/types'
import { useBoard } from '@/lib/store'

import Column from '@/components/column'

type BoardProps = {
  initialData: BoardType
}

export default function Board({ initialData }: BoardProps) {
  const { columnOrder, hydrate, reorderColumns, reorderTasks, moveTask } =
    useBoard(
      useShallow((state) => ({
        columnOrder: state.columnOrder,
        hydrate: state.hydrate,
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

  useEffect(() => {
    hydrate(initialData)
  }, [initialData, hydrate])

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
