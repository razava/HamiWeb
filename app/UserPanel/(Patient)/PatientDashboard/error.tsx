'use client' // Error components must be Client Components
 
// import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error)
  // }, [error])
 
  return (
    <div className="mx-auto text-gray-700 flex flex-col justify-center items-center gap-y-10 mt-6">
      <h2>مشکلی پیش آمده ...!</h2>
      <button
       className="text-white bg-blue hover:bg-blue50 p-2 w-fit rounded-md transition"
        onClick={() => reset()
        }
      >
      تلاش دوباره
      </button>
    </div>
  )
}