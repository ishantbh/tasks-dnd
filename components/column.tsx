'use client'

import { Droppable } from '@hello-pangea/dnd'

import type { ColumnType, TaskType } from '@/lib/types'

import Task from '@/components/task'

type ColumnProps = {
  column: ColumnType
  tasks: TaskType[]
}

export default function Column({ column, tasks }: ColumnProps) {
  return (
    <div className='m-2 border rounded border-foreground/15'>
      <h2 className='p-2 text-lg font-semibold'>{column.title}</h2>
      <Droppable droppableId={column.id}>
        {({ innerRef, droppableProps, placeholder }, { isDraggingOver }) => (
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
  )
}
