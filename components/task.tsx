'use client'

import { TaskType } from '@/lib/types'

type TaskProps = {
  task: TaskType
}

export default function Task({ task }: TaskProps) {
  return (
    <div className='border border-foreground/15 p-2 mb-2 rounded'>
      {task.content}
    </div>
  )
}
