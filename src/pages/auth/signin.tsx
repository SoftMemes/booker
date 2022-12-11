import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function SignIn() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('notion')
    } else if (status === 'authenticated') {
      void router.push('/')
    }
  }, [status])

  return (
    <div>
      {status === 'loading'
        ? '...'
        : status === 'unauthenticated'
        ? 'Sending you to Notion to authenticate ...'
        : 'Thank you for logging in'}
    </div>
  )
}
