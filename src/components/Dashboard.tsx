"use client"

import { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSensorReadings } from '@/lib/hooks/useSensorReadings'
import { useRadarTargets } from '@/lib/hooks/useRadarTargets'
import { useRfidEvents } from '@/lib/hooks/useRfidEvents'

import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import Card from '@/components/dashboard/Card'
import PillButton from '@/components/dashboard/PillButton'
import KPITile from '@/components/dashboard/KPITile'
import DeviceHealth from '@/components/dashboard/DeviceHealth'
import TelegramStream from '@/components/dashboard/TelegramStream'
import OccupancyChart from '@/components/dashboard/OccupancyChart'
import RadarView from '@/components/RadarView'
import EnvChart from '@/components/EnvChart'
import RfidLog from '@/components/RfidLog'

const ExpandIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
const DownloadIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>
const FilterIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>
const CpuIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>

export default function Dashboard() {
  const { readings, error: sensorError } = useSensorReadings()
  const { targets, targetCount, error: radarError } = useRadarTargets()
  const { events, error: rfidError } = useRfidEvents(50)

  const dbOk = !sensorError && !radarError && !rfidError

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
        <TopBar title="Living room · Overview" breadcrumb="WORKSPACE / NODE-01" dbOk={dbOk} />

        <main className="flex-1 overflow-auto p-[22px] flex flex-col gap-4">
          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3.5">
            <KPITile
              label="Occupancy now"
              value={targetCount}
              unit="people"
              trend={targetCount > 0 ? 'up' : undefined}
              spark={[0, 1, 1, 2, targetCount]}
              color="#1D9E75"
            />
            <KPITile
              label="Entries today"
              value={entriesToday}
              unit="cards"
              spark={[0, 2, 3, entriesToday]}
              color="#5DCAA5"
            />
            <KPITile
              label="Avg temperature"
              value={avgTemp}
              unit="°C"
              spark={tempSpark}
              color="#EF9F27"
            />
            <KPITile
              label="Node uptime"
              value="99.8"
              unit="%"
              spark={[100, 99.9, 100, 99.8, 99.9, 99.8]}
              color="#378ADD"
            />
          </div>

          {/* Radar + Telegram */}
          <div className="grid gap-3.5 min-h-[380px]" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
            <Card
              title="Live room map"
              subtitle="LD2450 · 24GHz · positions update in real-time"
              action={<PillButton><ExpandIcon /> Fullscreen</PillButton>}
              noPad
            >
              <RadarView targets={targets} />
            </Card>

            <Card
              title="Telegram bot stream"
              subtitle="@percipio_bot · push notifications"
              action={<PillButton><FilterIcon /> Filter</PillButton>}
            >
              <TelegramStream />
            </Card>
          </div>

          {/* EnvChart + Device health */}
          <div className="grid gap-3.5 min-h-[300px]" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
            <Card
              title="Environment"
              subtitle="BME280 · last 20 readings"
              action={<PillButton><DownloadIcon /> CSV</PillButton>}
            >
              <EnvChart readings={readings} />
            </Card>

            <Card
              title="Device health"
              subtitle="ESP32 peripheral status"
              action={<PillButton><CpuIcon /> Diagnostics</PillButton>}
            >
              <DeviceHealth />
            </Card>
          </div>

          {/* RFID log + Occupancy */}
          <div className="grid gap-3.5" style={{ gridTemplateColumns: '1.55fr 1fr' }}>
            <Card
              title="RFID access log"
              subtitle="MFRC522 · today"
              action={<PillButton><DownloadIcon /> Export</PillButton>}
            >
              <RfidLog events={events} />
            </Card>

            <Card
              title="Occupancy · 24h"
              subtitle="RFID entries per hour"
              action={<PillButton><ExpandIcon /></PillButton>}
            >
              <OccupancyChart events={events} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
