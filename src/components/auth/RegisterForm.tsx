"use client"

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Field from '@/components/ui/Field'
import TextInput from '@/components/ui/TextInput'
import { Icons } from '@/components/ui/icons'
import t from '@/lib/i18n'
import PasswordStrength, { scorePassword } from './PasswordStrength'
import { useAuth } from '@/context/AuthContext'

interface Errors {
  name?: string; email?: string; password?: string; terms?: string; form?: string
}

function validate(name: string, email: string, password: string, agreed: boolean): Errors {
  const e: Errors = {}
  const l = t.auth.validation
  if (!name)                                     e.name = l.required
  if (!email)                                    e.email = l.required
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) e.email = l.invalid_email
  if (!password)                                 e.password = l.required
  else if (scorePassword(password).score < 2)    e.password = l.password_weak
  if (!agreed)                                   e.terms = l.terms_required
  return e
}

export default function RegisterForm() {
  const { register } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState<Errors>({})

  const r = t.auth.register
  const strength = scorePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next = validate(name, email, password, agreed)
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    try {
      await register(email, password, name)
    } catch {
      setErrors({ form: t.auth.validation.register_failed })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Eyebrow + title */}
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] text-teal-500 uppercase tracking-[2px]">{r.eyebrow}</span>
        <h1 className="text-slate-50 text-[28px] font-medium tracking-[-0.4px] leading-[1.15] m-0">{r.title}</h1>
        <p className="text-slate-400 text-sm m-0">{r.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errors.form && (
          <p className="text-sm text-semantic-danger">{errors.form}</p>
        )}

        <Field label={r.name_label} error={errors.name}>
          <TextInput
            value={name}
            onChange={setName}
            placeholder={r.name_placeholder}
            icon={Icons.User}
            error={errors.name}
            autoFocus
          />
        </Field>

        <Field label={r.email_label} error={errors.email}>
          <TextInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={r.email_placeholder}
            icon={Icons.Mail}
            error={errors.email}
          />
        </Field>

        <Field label={r.password_label} error={errors.password}>
          <TextInput
            value={password}
            onChange={setPassword}
            type={showPass ? 'text' : 'password'}
            placeholder={r.password_placeholder}
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
          {password && <PasswordStrength strength={strength} />}
        </Field>

        <label className={`flex items-start gap-2.5 cursor-pointer text-[13px] leading-[1.5] mt-1
          ${errors.terms ? 'text-semantic-danger' : 'text-slate-400'}`}>
          <Checkbox checked={agreed} onChange={setAgreed} error={!!errors.terms} />
          <span>
            {r.terms_pre}{' '}
            <a href="#" className="text-teal-400 hover:underline underline-offset-4">{r.terms_link}</a>
            {' '}{r.terms_post}
          </span>
        </label>

        <Button type="submit" full loading={loading} className="mt-1">
          {r.submit} <span className="flex">{Icons.Arrow}</span>
        </Button>
      </form>

      {/* Footer link */}
      <div className="pt-3 border-t border-navy-700 text-[13px] text-slate-400">
        {r.has_account}{' '}
        <Link href="/login" className="text-teal-400 font-medium hover:underline underline-offset-4">
          {r.sign_in_link}
        </Link>
      </div>
    </>
  )
}
