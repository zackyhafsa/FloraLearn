import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Leaf01Icon, Login01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { login } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const session = login(email, password)
    if (!session) {
      setError('Email atau kata sandi tidak sesuai.')
      return
    }
    navigate({ to: session.role === 'student' ? '/' : session.role === 'teacher' ? '/teacher' : '/admin' })
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-4"><Card className="w-full max-w-md shadow-sm"><CardHeader className="text-center"><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><HugeiconsIcon icon={Leaf01Icon} size={25} /></div><CardTitle className="text-2xl">Masuk ke FloraLearn</CardTitle><CardDescription>Masuk sebagai siswa, guru, atau admin.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="flex flex-col gap-4"><div className="flex flex-col gap-2"><label htmlFor="email" className="text-sm font-medium">Email akun</label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="flex flex-col gap-2"><label htmlFor="password" className="text-sm font-medium">Kata sandi</label><Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>{error && <p className="text-sm text-destructive" role="alert">{error}</p>}<Button type="submit" className="w-full"><HugeiconsIcon icon={Login01Icon} data-icon="inline-start" />Masuk</Button><p className="text-center text-xs text-muted-foreground">Demo: semua akun memakai kata sandi `floralearn`</p></form></CardContent></Card></main>
}
