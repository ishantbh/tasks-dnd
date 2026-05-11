'use client'

import { DragDropContext, Droppable } from '@hello-pangea/dnd'

import { useBoardStore } from '@/hooks/useBoardStore'
import { useBoardDrag } from '@/hooks/useBoardDrag'

import Column from '@/components/column'
import CreateColumn from '@/components/create-column'

export default function Board({ boardId }: { boardId: string }) {
  const columnOrder = useBoardStore((state) => state.columnOrder)

  const { handleDragEnd } = useBoardDrag()

  return (
    <div className='flex flex-1 gap-8'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='board' direction='horizontal' type='column'>
          {({ droppableProps, innerRef, placeholder }) => (
            <div {...droppableProps} ref={innerRef} className='flex'>
              {columnOrder.map((columnId, index) => {
                return (
                  <Column key={columnId} columnId={columnId} index={index} />
                )
              })}
              {placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className='flex items-center justify-center'>
        <CreateColumn boardId={boardId} lastColumnId={columnOrder.at(-1)} />
      </div>
    </div>
  )
}
