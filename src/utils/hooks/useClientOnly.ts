import { useEffect, useState } from 'react'

export const useClientOnly = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(true)
  }, [])

  return loaded
}
