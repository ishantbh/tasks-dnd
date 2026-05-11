'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateKeyBetween } from 'fractional-indexing'

import { createColumn } from '@/lib/actions'
import { useBoardStore } from '@/hooks/useBoardStore'

type Props = {
  boardId: string
  lastColumnId: string | undefined
}

export default function CreateColumn({ boardId, lastColumnId }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const columns = useBoardStore((state) => state.columns)

  const router = useRouter()

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    if (!title?.trim()) {
      setError('Please enter a title')
      setLoading(false)

      return
    }

    try {
      let position

      if (!lastColumnId) {
        // first column
        position = generateKeyBetween(null, null)
      } else {
        const lastColumn = columns[lastColumnId]

        position = generateKeyBetween(lastColumn?.position, null)
      }

      await createColumn({ title, boardId, position })

      setOpen(false)
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='w-full block border border-violet-500/10 rounded-lg p-4 bg-violet-500/10 hover:bg-violet-500/15 transition-colors active:bg-violet-500/20 focus-visible:bg-violet-500/15'
      >
        Create New Column
      </button>

      <div
        className={`${open ? 'block' : 'hidden'} absolute inset-0 bg-black/50 backdrop-blur-sm`}
      >
        <div className='fixed inset-0 z-10 flex items-center justify-center'>
          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex flex-col min-h-full items-center justify-center p-4 text-center'>
              <div className='w-md mx-auto rounded-md p-4 bg-foreground/5 flex flex-col gap-4'>
                <button
                  className='self-end rounded-md bg-violet-500/10 p-2 text-sm transition-colors hover:bg-violet-500/15 active:bg-violet-500/20 focus-visible:bg-violet-500/15'
                  onClick={() => setOpen(false)}
                >
                  X
                </button>

                <h2 className='text-xl sm:text-2xl font-semibold mb-2'>
                  Create New Column
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className='flex flex-col gap-4 items-center'
                >
                  <input
                    id='column-title'
                    placeholder='Column Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className='border w-full rounded border-foreground/15 px-2 py-1'
                  />

                  <button
                    disabled={loading}
                    className='border border-violet-500/15 bg-violet-500/10 px-2 py-1 rounded-md text-sm transition-colors hover:bg-violet-500/15 active:bg-violet-500/20 focus-visible:bg-violet-500/15'
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>

                  {error && <p className='text-red-500 text-sm'>{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
