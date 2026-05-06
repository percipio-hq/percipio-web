"use client"

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Divider from '@/components/ui/Divider'
import Field from '@/components/ui/Field'
import TextInput from '@/components/ui/TextInput'
import { Icons } from '@/components/ui/icons'
import t from '@/lib/i18n'
import { useAuth } from '@/context/AuthContext'
import RfidPrompt from './RfidPrompt'

interface Errors { email?: string; password?: string; form?: string }

function validate(email: string, password: string): Errors {
  const e: Errors = {}
  const l = t.auth.validation
  if (!email)                                           e.email = l.required
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))        e.email = l.invalid_email
  if (!password)                                        e.password = l.required
  else if (password.length < 6)                         e.password = l.password_min
  return e
}

export default function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState<Errors>({})
  const [rfidMode, setRfidMode] = useState(false)

  const l = t.auth.login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next = validate(email, password)
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      await signIn(email, password)
    } catch {
      setErrors({ form: t.auth.validation.invalid_credentials })
    } finally {
      setLoading(false)
    }
  }

  if (rfidMode) return <RfidPrompt onCancel={() => setRfidMode(false)} />

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] text-teal-500 uppercase tracking-[2px]">{l.eyebrow}</span>
        <h1 className="text-slate-50 text-[28px] font-medium tracking-[-0.4px] leading-[1.15] m-0">{l.title}</h1>
        <p className="text-slate-400 text-sm m-0">{l.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        {errors.form && (
          <p className="text-sm text-semantic-danger">{errors.form}</p>
        )}

        <Field label={l.email_label} error={errors.email}>
          <TextInput
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={l.email_placeholder}
            icon={Icons.Mail}
            error={errors.email}
            autoFocus
          />
        </Field>

        <Field label={l.password_label} error={errors.password}>
          <TextInput
            name="password"
            value={password}
            onChange={setPassword}
            type={showPass ? 'text' : 'password'}
            placeholder={l.password_placeholder}
            icon={Icons.Lock}
            error={errors.password}
            right={
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="flex items-center p-1 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer bg-transparent border-none"
              >
                {showPass ? Icons.EyeOff : Icons.Eye}
              </button>
            }
          />
        </Field>

        <div className="flex justify-between items-center">
          <label className="inline-flex items-center gap-2 cursor-pointer text-slate-400 text-[13px]">
            <Checkbox checked={remember} onChange={setRemember} />
            {l.remember_me}
          </label>
          <button type="button" className="text-teal-400 text-[13px] hover:underline underline-offset-4 bg-transparent border-none cursor-pointer">
            {l.forgot_password}
          </button>
        </div>

        <Button type="submit" full loading={loading}>
          {l.submit} <span className="flex">{Icons.Arrow}</span>
        </Button>
      </form>

      <Divider label={l.divider} />

      <button
        type="button"
        onClick={() => setRfidMode(true)}
        className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg border border-navy-700 text-slate-400 text-[13px] hover:border-teal-700 hover:text-teal-400 transition-colors cursor-pointer bg-transparent"
      >
        <span className="flex">{Icons.Card}</span>
        {l.rfid_button}
      </button>

      <div className="pt-3 border-t border-navy-700 text-[13px] text-slate-400">
        {l.no_account}{' '}
        <Link href="/register" className="text-teal-400 font-medium hover:underline underline-offset-4">
          {l.request_access}
        </Link>
      </div>
    </>
  )
}
