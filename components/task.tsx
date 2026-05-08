'use client'

import { TaskType } from '@/lib/types'
import { Draggable } from '@hello-pangea/dnd'

type TaskProps = {
  task: TaskType
  index: number
}

export default function Task({ task, index }: TaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className='border border-foreground/15 p-2 mb-2 rounded bg-background'
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}
