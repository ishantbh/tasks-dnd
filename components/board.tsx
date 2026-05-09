'use client'

import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { useBoardStore } from '@/hooks/useBoardStore'
import { useBoardDrag } from '@/hooks/useBoardDrag'

import Column from '@/components/column'

export default function Board() {
  const columnOrder = useBoardStore((state) => state.columnOrder)

  const { handleDragEnd } = useBoardDrag()

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
