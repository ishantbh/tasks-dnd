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

    // Reorder items in the same column
    if (destination.droppableId === source.droppableId) {
      setBoard((board) => {
        const start = board.columns[source.droppableId]
        const newTaskIds = [...start.taskIds]
        newTaskIds.splice(source.index, 1)
        newTaskIds.splice(destination.index, 0, draggableId)

        const newColumn = { ...start, taskIds: newTaskIds }

        const newBoard = {
          ...board,
          columns: { ...board.columns, [newColumn.id]: newColumn },
        }

        return newBoard
      })

      return
    }

    // Moving items between columns
    setBoard((board) => {
      const start = board.columns[source.droppableId]
      const finish = board.columns[destination.droppableId]

      const startTaskIds = [...start.taskIds]
      startTaskIds.splice(source.index, 1)
      const newStart = { ...start, taskIds: startTaskIds }

      const finishTaskIds = [...finish.taskIds]
      finishTaskIds.splice(destination.index, 0, draggableId)
      const newFinish = { ...finish, taskIds: finishTaskIds }

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      }

      return newBoard
    })
  }

  return (
    <div className='flex'>
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
