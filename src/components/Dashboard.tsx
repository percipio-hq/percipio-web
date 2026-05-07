"use client"

import { useMemo, useRef } from 'react'
import { useSensorReadings } from '@/lib/hooks/useSensorReadings'
import { useRadarTargets } from '@/lib/hooks/useRadarTargets'
import { useRfidEvents } from '@/lib/hooks/useRfidEvents'
import { useTelegramNotifier } from '@/lib/hooks/useTelegramNotifier'
import t from '@/lib/i18n'

import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import Card from '@/components/dashboard/Card'
import PillButton from '@/components/dashboard/PillButton'
import KPITile from '@/components/dashboard/KPITile'
import DeviceHealth from '@/components/dashboard/DeviceHealth'
import TelegramStream from '@/components/dashboard/TelegramStream'
import StatusBar from '@/components/StatusBar'
import RadarView from '@/components/RadarView'
import EnvChart from '@/components/EnvChart'
import RfidLog from '@/components/RfidLog'

const d = t.dashboard

const ExpandIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
const DownloadIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>
const CpuIcon      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>

export default function Dashboard() {
  const { readings, error: sensorError } = useSensorReadings()
  const { targets, targetCount, error: radarError } = useRadarTargets()
  const { events, error: rfidError } = useRfidEvents(50)
  useTelegramNotifier()

  const dbOk = !sensorError && !radarError && !rfidError
  const radarRef = useRef<HTMLDivElement>(null)

  const handleFullscreen = () => radarRef.current?.requestFullscreen()

  const downloadCSV = () => {
    const rows = [
      'Time,Temperature (°C),Humidity (%),Pressure (hPa)',
      ...readings.map((r) =>
        `${r.created_at.toISOString()},${r.temperature},${r.humidity},${r.pressure}`
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `percipio-env-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadRfidCSV = () => {
    const rows = [
      'Time,Card UID,Name,Authorized',
      ...events.map((e) =>
        `${e.created_at.toISOString()},${e.card_uid},${e.card_name},${e.authorized}`
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `percipio-rfid-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const avgTemp = useMemo(() => {
    if (!readings.length) return '—'
    const avg = readings.reduce((s, r) => s + r.temperature, 0) / readings.length
    return avg.toFixed(1)
  }, [readings])

  const tempSpark = useMemo(() => readings.map((r) => r.temperature), [readings])

  const today = new Date().toDateString()
  const entriesToday = useMemo(
    () => events.filter((e) => e.created_at.toDateString() === today && e.authorized).length,
    [events, today]
  )

  return (
    <div className="flex h-screen bg-navy-950 text-slate-50 overflow-hidden">
      <Sidebar targetCount={targetCount} rfidToday={entriesToday} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar dbOk={dbOk} />

        <main className="flex-1 overflow-auto p-[22px] flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3.5">
            <KPITile
              label={d.kpi.occupancy}
              value={targetCount}
              unit={d.kpi.unit_people}
              trend={targetCount > 0 ? 'up' : undefined}
              spark={[0, 1, 1, 2, targetCount]}
              color="var(--color-brand-primary)"
            />
            <KPITile
              label={d.kpi.entries}
              value={entriesToday}
              unit={d.kpi.unit_cards}
              spark={[0, 2, 3, entriesToday]}
              color="var(--color-brand-light)"
            />
            <KPITile
              label={d.kpi.avg_temp}
              value={avgTemp}
              unit={d.kpi.unit_celsius}
              spark={tempSpark}
              color="var(--color-warning)"
            />
            <KPITile
              label={d.kpi.uptime}
              value="99.8"
              unit={d.kpi.unit_percent}
              spark={[100, 99.9, 100, 99.8, 99.9, 99.8]}
              color="var(--color-info)"
            />
          </div>

          <div className="grid gap-3.5 min-h-[380px]" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
            <div ref={radarRef} className="flex flex-col min-h-0 bg-navy-950">
              <Card
                title={d.map.title}
                subtitle={d.map.subtitle}
                action={<PillButton onClick={handleFullscreen}><ExpandIcon /> {d.map.btn_fullscreen}</PillButton>}
                noPad
              >
                <RadarView targets={targets} />
              </Card>
            </div>
            <Card
              title={d.telegram.title}
              subtitle={d.telegram.subtitle}
            >
              <TelegramStream />
            </Card>
          </div>

          <div className="grid gap-3.5 min-h-[300px]" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
            <Card
              title={d.env.title}
              subtitle={d.env.subtitle}
              action={<PillButton onClick={downloadCSV}><DownloadIcon /> {d.env.btn_csv}</PillButton>}
            >
              <EnvChart readings={readings} />
            </Card>
            <Card
              title={d.devices.title}
              subtitle={d.devices.subtitle}
              action={<PillButton><CpuIcon /> {d.devices.btn_diagnostics}</PillButton>}
            >
              <DeviceHealth />
            </Card>
          </div>

          <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
            <Card
              title={d.rfid.title}
              subtitle={d.rfid.subtitle}
              action={<PillButton onClick={downloadRfidCSV}><DownloadIcon /> {d.rfid.btn_export}</PillButton>}
            >
              <RfidLog events={events} />
            </Card>
            <Card
              title="Node status"
              subtitle="WiFi · Firestore · occupancy"
            >
              <StatusBar peopleCount={targetCount} wifiOk={true} dbOk={dbOk} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
