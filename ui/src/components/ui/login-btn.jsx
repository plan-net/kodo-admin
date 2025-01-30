"use client";

import { useSession, signIn, signOut } from "next-auth/react"
// import { signIn } from "next-auth/react"
import { Button } from '@/components/ui/button' 

export default function LoginButton() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <Button variant="outline" onClick={() => signIn()}>Sign in</Button>
    </>
  )
}