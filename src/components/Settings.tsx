"use client"

import { useState, useEffect } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import t from '@/lib/i18n'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import Button from '@/components/ui/Button'
import TextInput from '@/components/ui/TextInput'

const s = t.dashboard.settings
const menu = t.dashboard.sidebar.menu

const COLLECTIONS: { id: string; desc: string }[] = [
  { id: 'radar_targets',   desc: s.col_radar_desc },
  { id: 'sensor_readings', desc: s.col_sensor_desc },
  { id: 'rfid_events',     desc: s.col_rfid_desc },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] text-slate-600 tracking-[1.5px] uppercase mb-2.5">{title}</div>
      <div className="bg-navy-900 border border-navy-700 rounded-[10px] overflow-hidden">{children}</div>
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-[18px] py-[14px] flex flex-col gap-1.5">
      <label className="text-[12px] text-slate-500">{label}</label>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[14px]">
      <span className="text-[13px] text-slate-400">{label}</span>
      <span className="font-mono text-[12px] text-slate-100">{value}</span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-navy-700" />
}

export default function Settings() {
  const { user, signOut, deleteAccount, updateDisplayName } = useAuth()
  const [name, setName] = useState(user?.displayName ?? '')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  const [counts, setCounts] = useState<Record<string, number | null>>({})
  const [clearing, setClearing] = useState<Record<string, boolean>>({})
  const [cleared, setCleared] = useState<Record<string, boolean>>({})

  useEffect(() => {
    Promise.all(
      COLLECTIONS.map(async (col) => {
        try {
          const snap = await getCountFromServer(collection(db, col.id))
          return { id: col.id, count: snap.data().count }
        } catch {
          return { id: col.id, count: null }
        }
      })
    ).then((results) => {
      const map: Record<string, number | null> = {}
      results.forEach((r) => { map[r.id] = r.count })
      setCounts(map)
    })
  }, [])

  const saveName = async () => {
    if (!name.trim()) return
    setNameSaving(true)
    try {
      await updateDisplayName(name.trim())
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2500)
    } finally {
      setNameSaving(false)
    }
  }

  const clearCollection = async (colId: string) => {
    if (!confirm(`Delete all documents in "${colId}"? This cannot be undone.`)) return
    setClearing((p) => ({ ...p, [colId]: true }))
    try {
      await fetch('/api/clear-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: colId }),
      })
      setCounts((p) => ({ ...p, [colId]: 0 }))
      setCleared((p) => ({ ...p, [colId]: true }))
      setTimeout(() => setCleared((p) => ({ ...p, [colId]: false })), 2500)
    } finally {
      setClearing((p) => ({ ...p, [colId]: false }))
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(menu.delete_confirm)) return
    try {
      await deleteAccount()
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/requires-recent-login') alert(menu.delete_reauth)
    }
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '—'

  return (
    <div className="flex h-screen bg-navy-950 text-slate-50 overflow-hidden">
      <Sidebar targetCount={0} rfidToday={0} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar dbOk={true} title={s.title} breadcrumb={s.breadcrumb} />

        <main className="flex-1 overflow-auto p-[22px] flex justify-center">
          <div className="flex flex-col gap-6 w-full max-w-[600px]">

            {/* Account */}
            <Section title={s.section_account}>
              <FieldRow label={s.name_label}>
                <TextInput value={name} onChange={setName} placeholder={s.name_label} />
              </FieldRow>
              <Divider />
              <FieldRow label={s.email_label}>
                <TextInput value={user?.email ?? ''} onChange={() => {}} disabled />
              </FieldRow>
              <div className="px-[18px] pb-[18px]">
                <Button onClick={saveName} loading={nameSaving} disabled={!name.trim()}>
                  {nameSaved ? s.saved : s.save}
                </Button>
              </div>
            </Section>

            {/* Data */}
            <Section title={s.section_data}>
              <div className="flex items-start gap-2.5 px-[18px] py-3 bg-semantic-warning/5 border-b border-semantic-warning/20">
                <span className="text-semantic-warning text-[13px] mt-px">⚠</span>
                <span className="text-[12px] text-semantic-warning/70 leading-relaxed">{s.data_warning}</span>
              </div>
              {COLLECTIONS.map((col, i) => (
                <div key={col.id}>
                  {i > 0 && <Divider />}
                  <div className="flex items-center justify-between px-[18px] py-[14px]">
                    <div>
                      <div className="font-mono text-[13px] text-slate-100">{col.id}</div>
                      <div className="font-mono text-[11px] text-slate-600 mt-0.5">{col.desc}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] text-slate-500 tabular-nums w-[54px] text-right">
                        {counts[col.id] === undefined ? '—' : counts[col.id] === null ? '—' : `${counts[col.id]} ${s.docs}`}
                      </span>
                      <button
                        onClick={() => clearCollection(col.id)}
                        disabled={clearing[col.id]}
                        className="h-8 px-3 rounded-md text-[12px] font-medium bg-semantic-danger/10 text-semantic-danger border border-semantic-danger/20 hover:bg-semantic-danger/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {clearing[col.id] ? s.btn_clearing : cleared[col.id] ? s.btn_cleared : s.btn_clear}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Section>

            {/* System */}
            <Section title={s.section_system}>
              <InfoRow label={s.sys_firmware}     value={s.sys_firmware_val} />
              <Divider />
              <InfoRow label={s.sys_web_build}    value={s.sys_web_build_val} />
              <Divider />
              <InfoRow label={s.sys_firestore}    value={projectId} />
            </Section>

            {/* Account actions */}
            <Section title={s.section_danger}>
              <div className="flex items-center gap-3 px-[18px] py-[18px]">
                <Button variant="ghost" onClick={() => signOut()}>
                  {menu.log_out}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-semantic-danger border-semantic-danger/30 hover:bg-semantic-danger/10"
                >
                  {menu.delete_account}
                </Button>
              </div>
            </Section>

          </div>
        </main>
      </div>
    </div>
  )
}
