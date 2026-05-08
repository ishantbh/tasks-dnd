'use client'

import { useState } from 'react'

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'

import { initialData } from '@/lib/data'

import Column from '@/components/column'

export default function Board() {
  const [board, setBoard] = useState(initialData)

  function handleDragEnd(result: DropResult<string>) {
    const { draggableId, source, destination } = result

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return
    }

    setBoard((board) => {
      const column = board.columns[source.droppableId]
      const newTaskIds = [...column.taskIds]
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = { ...column, taskIds: newTaskIds }

      const newBoard = {
        ...board,
        columns: { ...board.columns, [newColumn.id]: newColumn },
      }

      return newBoard
    })
  }

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
