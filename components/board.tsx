'use client'

import { useState } from 'react'

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'

import { initialData } from '@/lib/data'

import Column from '@/components/column'

export default function Board() {
  const [board, setBoard] = useState(initialData)

  function handleDragEnd(result: DropResult<string>) {}

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId]
          const tasks = column.taskIds.map((taskId) => board.tasks[taskId])

          return <Column key={columnId} column={column} tasks={tasks} />
        })}
      </DragDropContext>
    </div>
  )
}
