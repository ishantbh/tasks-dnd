'use client'

import { memo } from 'react'

import { useShallow } from 'zustand/shallow'
import { Draggable, Droppable } from '@hello-pangea/dnd'

import { useBoard } from '@/lib/store'

import Task from '@/components/task'

type ColumnProps = {
  columnId: string
  index: number
}

const Column = memo(function ({ columnId, index }: ColumnProps) {
  const { column, taskIds } = useBoard(
    useShallow((state) => ({
      column: state.columns[columnId],
      taskIds: state.taskOrderByColumn[columnId],
    })),
  )

  return (
    <Draggable draggableId={column.id} index={index}>
      {({ draggableProps, innerRef, dragHandleProps }) => (
        <div
          ref={innerRef}
          {...draggableProps}
          className='w-55 m-2 border rounded border-foreground/15 flex flex-col bg-background'
        >
          <h2 {...dragHandleProps} className='p-2 text-lg font-semibold'>
            {column.title}
          </h2>
          <Droppable droppableId={column.id}>
            {(
              { innerRef, droppableProps, placeholder },
              { isDraggingOver },
            ) => (
              <div
                ref={innerRef}
                {...droppableProps}
                className={`flex-1 min-h-25 p-2 transition ${isDraggingOver ? 'bg-foreground/5' : 'bg-background'}`}
              >
                {taskIds.map((taskId, index) => (
                  <Task key={taskId} taskId={taskId} index={index} />
                ))}
                {placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
})

export default Column
