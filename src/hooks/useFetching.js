import { useState } from 'react'

export const useFetching = (callback, message) => {
  const [isLoading, setIsLoading] = useState(true)
  const fetching = async () => {
    try {
      await callback()
      setIsLoading(false)
    } catch (err) {
      console.warn(err)
      alert(message)
    }
  }

  return [fetching, isLoading]
}
