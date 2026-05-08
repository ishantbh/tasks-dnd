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
          className={`border border-foreground/15 p-2 mb-2 rounded flex items-center gap-2 ${isDragging ? 'bg-foreground/10' : 'bg-background'}`}
        >
          <span {...dragHandleProps} className='size-4.5 text-foreground/50'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='9' cy='12' r='1' />
              <circle cx='9' cy='5' r='1' />
              <circle cx='9' cy='19' r='1' />
              <circle cx='15' cy='12' r='1' />
              <circle cx='15' cy='5' r='1' />
              <circle cx='15' cy='19' r='1' />
            </svg>
          </span>
          {task.content}
        </div>
      )}
    </Draggable>
  )
}
