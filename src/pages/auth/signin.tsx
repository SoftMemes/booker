import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function SignIn() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log('No JWT')
      console.log(status)
      void signIn('notion')
    } else if (status === 'authenticated') {
      void router.push('/')
    }
  }, [status])

  return <div>Sending you to Notion to authenticate ...</div>
}
