'use client'

import { Draggable, Droppable } from '@hello-pangea/dnd'

import type { ColumnType, TaskType } from '@/lib/types'

import Task from '@/components/task'

type ColumnProps = {
  column: ColumnType
  index: number
  tasks: TaskType[]
}

export default function Column({ column, tasks, index }: ColumnProps) {
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
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
