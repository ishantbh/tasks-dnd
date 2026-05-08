'use client'

import type { ColumnType, TaskType } from '@/lib/types'

import Task from '@/components/task'
import { Droppable } from '@hello-pangea/dnd'

type ColumnProps = {
  column: ColumnType
  tasks: TaskType[]
}

export default function Column({ column, tasks }: ColumnProps) {
  return (
    <div className='m-2 border rounded border-foreground/15'>
      <h2 className='p-2 text-lg font-semibold'>{column.title}</h2>
      <Droppable droppableId={column.id}>
        {({ innerRef, droppableProps, placeholder }) => (
          <div ref={innerRef} {...droppableProps} className='p-2'>
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
