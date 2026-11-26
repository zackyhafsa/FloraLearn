import * as React from 'react'
import { CheckmarkCircle02Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createUser,
  updateUser,
  type UserAccount,
  type UserRole,
  type UserStatus,
} from '@/lib/user-store'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allowedRoles: UserRole[]
  editingUser?: UserAccount | null
  onSaved?: (message: string) => void
}

const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Siswa',
  teacher: 'Guru',
  admin: 'Admin',
}

const CLASS_OPTIONS = ['10 IPA 1', '10 IPA 2', '10 IPA 3', '11 IPA 1']

export function UserFormDialog({
  open,
  onOpenChange,
  allowedRoles,
  editingUser,
  onSaved,
}: UserFormDialogProps) {
  const isEditing = Boolean(editingUser)
  const defaultRole = editingUser?.role ?? allowedRoles[0] ?? 'student'

  const [role, setRole] = React.useState<UserRole>(defaultRole)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('ekostream')
  const [identifier, setIdentifier] = React.useState('')
  const [className, setClassName] = React.useState('10 IPA 1')
  const [subject, setSubject] = React.useState('Biologi Kelas 10')
  const [status, setStatus] = React.useState<UserStatus>('Aktif')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    setError('')
    if (editingUser) {
      setRole(editingUser.role)
      setName(editingUser.name)
      setEmail(editingUser.email)
      setPassword(editingUser.password)
      setIdentifier(editingUser.identifier ?? '')
      setClassName(editingUser.className ?? '10 IPA 1')
      setSubject(editingUser.subject ?? 'Biologi Kelas 10')
      setStatus(editingUser.status)
    } else {
      setRole(allowedRoles[0] ?? 'student')
      setName('')
      setEmail('')
      setPassword('ekostream')
      setIdentifier('')
      setClassName('10 IPA 1')
      setSubject('Biologi Kelas 10')
      setStatus('Aktif')
    }
  }, [open, editingUser, allowedRoles])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Nama lengkap dan email wajib diisi.')
      return
    }

    if (isEditing && editingUser) {
      const result = updateUser(editingUser.id, {
        name,
        email,
        role,
        password: password || editingUser.password,
        identifier,
        className: role === 'student' ? className : undefined,
        subject: role === 'teacher' ? subject : undefined,
        status,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      onOpenChange(false)
      onSaved?.(`Data akun "${name.trim()}" berhasil diperbarui.`)
      return
    }

    const result = createUser({
      name,
      email,
      role,
      password: password || 'ekostream',
      identifier,
      className: role === 'student' ? className : undefined,
      subject: role === 'teacher' ? subject : undefined,
      status,
    })

    if (!result.ok) {
      setError(result.error)
      return
    }

    onOpenChange(false)
    onSaved?.(`Akun ${ROLE_LABELS[role]} "${result.user.name}" berhasil ditambahkan dan siap login.`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1 text-primary text-[11px]">
              <HugeiconsIcon icon={UserAdd01Icon} size={13} />
              {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </Badge>
            <DialogTitle>
              {isEditing
                ? `Edit Akun ${ROLE_LABELS[role]}`
                : allowedRoles.length === 1
                  ? `Tambah Akun ${ROLE_LABELS[allowedRoles[0]]}`
                  : 'Tambah Akun Pengguna'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Akun yang berstatus Aktif dapat langsung digunakan untuk masuk melalui halaman login.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {/* Role selection (shown as Select for Admin, Badge for Teacher) */}
            {allowedRoles.length > 1 ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Peran Akun</label>
                  <Select
                    value={role}
                    onValueChange={(v) => setRole((v as UserRole) ?? 'student')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {allowedRoles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Status Akun</label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus((v as UserStatus) ?? 'Aktif')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 px-3 py-2">
                <span className="text-xs text-muted-foreground">Peran yang ditambahkan</span>
                <Badge variant="secondary" className="text-xs">
                  {ROLE_LABELS[role]}
                </Badge>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-name" className="text-xs font-semibold">
                Nama Lengkap <span className="text-destructive">*</span>
              </label>
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === 'student'
                    ? 'Contoh: Nadia Putri'
                    : role === 'teacher'
                      ? 'Contoh: Bu Sri Rahayu, S.Si.'
                      : 'Contoh: Admin Akademik'
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-email" className="text-xs font-semibold">
                  Email Login <span className="text-destructive">*</span>
                </label>
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`nama@${role === 'student' ? 'siswa' : role === 'teacher' ? 'guru' : 'sekolah'}.ekostream.id`}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-password" className="text-xs font-semibold">
                  Kata Sandi
                </label>
                <Input
                  id="user-password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Default: ekostream"
                />
              </div>
            </div>

            {role === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="student-nisn" className="text-xs font-semibold">
                    NISN
                  </label>
                  <Input
                    id="student-nisn"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: 0081234575"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Kelas</label>
                  <Select
                    value={className}
                    onValueChange={(v) => setClassName(v ?? '10 IPA 1')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CLASS_OPTIONS.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="teacher-nip" className="text-xs font-semibold">
                    NIP / NUPTK
                  </label>
                  <Input
                    id="teacher-nip"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Contoh: 198805102015022001"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="teacher-subject" className="text-xs font-semibold">
                    Mata Pelajaran
                  </label>
                  <Input
                    id="teacher-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Biologi Kelas 10"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
              {isEditing ? 'Simpan Perubahan' : 'Simpan Akun'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
