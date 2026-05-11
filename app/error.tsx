'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <h2 className='text-center text-xl sm:text-2xl font-semibold'>
        Something went wrong!
      </h2>
      <button
        className='mt-4 rounded-md px-4 py-2 text-sm transition-colors bg-foreground/5 font-semibold border border-foreground/5 hover:bg-foreground/10'
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
