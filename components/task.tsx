'use client'

import { Draggable } from '@hello-pangea/dnd'

import { TaskType } from '@/lib/types'

type TaskProps = {
  task: TaskType
  index: number
}

export default function Task({ task, index }: TaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <div
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={`border border-foreground/15 p-2 mb-2 rounded ${isDragging ? 'bg-gray-900' : 'bg-background'}`}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}
