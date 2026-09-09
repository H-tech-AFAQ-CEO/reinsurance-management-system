'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  FileBarChart,
  FileSpreadsheet,
  Filter,
  LayoutDashboard,
  Mail,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react'

type Policy = {
  id: string
  number: string
  cedant: string
  occupancy: string
  premium: number
  sumInsured: number
  market: string
  expiry: string
  premiumStatus: string
  status: string
}

const initialPolicies: Policy[] = [
  { id: '1', number: 'NR-2026-0042', cedant: 'Atlas Mining PLC', occupancy: 'Mining / Quarrying', premium: 485000, sumInsured: 25000000, market: 'SCOR Global P&C', expiry: '31 Mar 2027', premiumStatus: 'Received', status: 'Active' },
  { id: '2', number: 'NR-2026-0041', cedant: 'Meridian Hospitality Group', occupancy: 'Hotels & Hospitality', premium: 127500, sumInsured: 8500000, market: 'Hannover Re', expiry: '14 Jan 2027', premiumStatus: 'Outstanding', status: 'Active' },
  { id: '3', number: 'NR-2025-0098', cedant: 'Coastal Energy Partners', occupancy: 'Offshore Energy', premium: 920000, sumInsured: 60000000, market: 'Munich Re', expiry: '31 Oct 2026', premiumStatus: 'Part-paid', status: 'Active' },
  { id: '4', number: 'NR-2025-0087', cedant: 'Greenline Logistics', occupancy: 'Warehousing', premium: 86000, sumInsured: 4200000, market: 'Swiss Re Corporate', expiry: '22 Nov 2026', premiumStatus: 'Received', status: 'Active' },
  { id: '5', number: 'NR-2025-0071', cedant: 'Northbridge Foods', occupancy: 'Food Processing', premium: 64500, sumInsured: 3100000, market: 'Lloyd\'s Market', expiry: '08 Dec 2026', premiumStatus: 'Outstanding', status: 'Active' },
]

const marketFor = (occupancy: string, sumInsured: number) => {
  if (/mining|quarry/i.test(occupancy)) return 'SCOR Global P&C'
  if (/energy|offshore/i.test(occupancy) || sumInsured > 50000000) return 'Munich Re'
  if (/hotel|hospitality/i.test(occupancy)) return 'Hannover Re'
  if (/warehouse|logistics/i.test(occupancy)) return 'Swiss Re Corporate'
  return 'Lloyd\'s Market'
}

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [policies, setPolicies] = useState(initialPolicies)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ number: '', cedant: '', occupancy: '', premium: '', sumInsured: '', expiry: '' })

  useEffect(() => {
    fetch('/api/policies')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load policies')))
      .then((rows) => setPolicies(rows.map((row: { id: string; policyNumber: string; cedant: string; occupancy: string; premium: string; sumInsured: string; market: string; expiryDate: string; premiumStatus: string; status: string }) => ({
        id: row.id, number: row.policyNumber, cedant: row.cedant, occupancy: row.occupancy, premium: Number(row.premium), sumInsured: Number(row.sumInsured), market: row.market, expiry: new Date(row.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), premiumStatus: row.premiumStatus, status: row.status,
      }))))
      .catch(() => undefined)
  }, [])

  const filtered = useMemo(() => policies.filter((policy) => `${policy.number} ${policy.cedant} ${policy.occupancy} ${policy.market}`.toLowerCase().includes(query.toLowerCase())), [policies, query])
  const outstanding = policies.filter((p) => p.premiumStatus !== 'Received').reduce((sum, p) => sum + p.premium, 0)
  const totalPremium = policies.reduce((sum, p) => sum + p.premium, 0)

  async function savePolicy() {
    if (!form.number || !form.cedant || !form.occupancy) return
    const market = marketFor(form.occupancy, Number(form.sumInsured) || 0)
    const response = await fetch('/api/policies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ policyNumber: form.number, cedant: form.cedant, occupancy: form.occupancy, premium: form.premium, sumInsured: form.sumInsured, market, expiryDate: form.expiry || undefined }) })
    if (!response.ok) return
    const created = await response.json()
    setPolicies((current) => [{ id: created.id, number: created.policyNumber, cedant: created.cedant, occupancy: created.occupancy, premium: Number(created.premium), sumInsured: Number(created.sumInsured), market: created.market, expiry: new Date(created.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), premiumStatus: created.premiumStatus, status: created.status }, ...current])
    setForm({ number: '', cedant: '', occupancy: '', premium: '', sumInsured: '', expiry: '' })
    setShowForm(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#14213d]">
      <aside className="fixed inset-y-0 left-0 hidden w-[244px] border-r border-[#e4e9f2] bg-white lg:flex lg:flex-col">
        <div className="flex h-[76px] items-center gap-3 border-b border-[#eef1f6] px-7"><div className="flex size-9 items-center justify-center rounded-xl bg-[#203b73] text-white"><ShieldCheck className="size-5" /></div><span className="text-[15px] font-semibold tracking-[-0.02em]">Northstar <span className="text-[#71809a]">Re</span></span></div>
        <div className="flex flex-1 flex-col px-4 py-6"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa6ba]">Workspace</p><nav className="flex flex-col gap-1">{[['Overview', LayoutDashboard], ['Policies', BriefcaseBusiness], ['Reminders', Bell], ['Reports', FileBarChart]].map(([label, Icon]) => <button key={label as string} onClick={() => setActive(label as string)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${active === label ? 'bg-[#edf2fb] text-[#203b73]' : 'text-[#71809a] hover:bg-[#f6f8fb]'}`}><Icon className="size-[17px]" />{label as string}{label === 'Reminders' && <span className="ml-auto rounded-full bg-[#e85555] px-1.5 py-0.5 text-[10px] font-bold text-white">3</span>}</button>)}</nav><p className="px-3 pb-3 pt-9 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa6ba]">Manage</p><nav className="flex flex-col gap-1"><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#71809a] hover:bg-[#f6f8fb]"><Settings2 className="size-[17px]" />Settings</button><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#71809a] hover:bg-[#f6f8fb]"><CircleHelp className="size-[17px]" />Help centre</button></nav><div className="mt-auto rounded-xl bg-[#f1f5fc] p-4"><div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white text-[#3d65b2]"><Sparkles className="size-4" /></div><p className="text-[12px] font-semibold text-[#203b73]">Market intelligence</p><p className="mt-1 text-[11px] leading-5 text-[#7b8ba4]">Get sharper placement suggestions as you add risk details.</p></div></div>
      </aside>
      <section className="lg:pl-[244px]"><header className="flex h-[76px] items-center justify-between border-b border-[#e4e9f2] bg-white px-5 sm:px-8"><div className="flex items-center gap-3"><button className="lg:hidden"><Menu className="size-5 text-[#71809a]" /></button><div><p className="text-[11px] font-medium text-[#9aa6ba]">Wednesday, 9 September 2026</p><h1 className="mt-0.5 text-[18px] font-semibold tracking-[-0.03em]">Good morning, Afaq</h1></div></div><div className="flex items-center gap-3"><button onClick={() => setShowNotifications(!showNotifications)} className="relative flex size-9 items-center justify-center rounded-lg border border-[#e5eaf2] text-[#71809a] hover:bg-[#f7f9fc]"><Bell className="size-[17px]" /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#e85555]" /></button><div className="flex items-center gap-2 border-l border-[#e9edf3] pl-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#dce6f7] text-[11px] font-bold text-[#34548f]">AA</div><div className="hidden sm:block"><p className="text-[12px] font-semibold">Afaq Ahmad</p><p className="text-[10px] text-[#9aa6ba]">Senior Broker</p></div><ChevronDown className="hidden size-4 text-[#9aa6ba] sm:block" /></div></div>{showNotifications && <div className="absolute right-5 top-[64px] z-20 w-72 rounded-xl border border-[#e5eaf2] bg-white p-4 shadow-xl"><p className="text-sm font-semibold">Upcoming reminders</p><div className="mt-3 flex flex-col gap-3 text-xs"><div className="rounded-lg bg-[#fff6e7] p-3"><b>3 renewals</b> need attention within 60 days.</div><div className="rounded-lg bg-[#edf6f2] p-3"><b>£127,500</b> in outstanding premium.</div></div></div>}</header>
        <div className="mx-auto max-w-[1420px] px-5 py-7 sm:px-8"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#71809a]">{active}</p><h2 className="text-[28px] font-semibold tracking-[-0.045em]">{active === 'Overview' ? 'Your book at a glance' : active}</h2><p className="mt-2 text-[13px] text-[#8290a7]">A clear view of your reinsurance portfolio and what needs action.</p></div><button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#203b73] px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#294c91]"><Plus className="size-4" />Add policy</button></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={BriefcaseBusiness} label="Active policies" value={policies.length.toString()} note="+2 this month" positive /><Stat icon={TrendingUp} label="Gross premium" value={money(totalPremium)} note="+8.4% vs last month" positive /><Stat icon={CalendarDays} label="Renewals next 60 days" value="3" note="Needs attention" /><Stat icon={Mail} label="Outstanding premium" value={money(outstanding)} note="2 accounts" /></div>
          <div className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]"><section className="rounded-xl border border-[#e4e9f2] bg-white"><div className="flex flex-col gap-4 border-b border-[#eef1f6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-[14px] font-semibold">Policy portfolio</h3><p className="mt-1 text-[11px] text-[#8b98ad]">Search, filter and manage every placement.</p></div><div className="flex gap-2"><div className="flex h-9 items-center gap-2 rounded-lg border border-[#e4e9f2] px-3"><Search className="size-4 text-[#9aa6ba]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search policies..." className="w-32 bg-transparent text-[11px] outline-none placeholder:text-[#aeb8c8] sm:w-44" /></div><button className="flex size-9 items-center justify-center rounded-lg border border-[#e4e9f2] text-[#71809a]"><Filter className="size-4" /></button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-[#f0f2f6] text-[10px] font-bold uppercase tracking-[0.1em] text-[#9aa6ba]"><th className="px-5 py-3 font-bold">Policy / cedant</th><th className="px-3 py-3 font-bold">Premium</th><th className="px-3 py-3 font-bold">Market fit</th><th className="px-3 py-3 font-bold">Renewal</th><th className="px-5 py-3 font-bold">Status</th></tr></thead><tbody>{filtered.map((policy) => <tr key={policy.id} className="border-b border-[#f3f5f8] last:border-0 hover:bg-[#fbfcfe]"><td className="px-5 py-4"><p className="text-[12px] font-semibold text-[#263957]">{policy.number}</p><p className="mt-1 text-[11px] text-[#8a98ad]">{policy.cedant}</p></td><td className="px-3 py-4"><p className="text-[12px] font-medium">{money(policy.premium)}</p><p className="mt-1 text-[10px] text-[#8a98ad]">{policy.premiumStatus}</p></td><td className="px-3 py-4"><div className="flex items-center gap-1.5 text-[11px] font-medium text-[#3d65b2]"><Sparkles className="size-3" />{policy.market}</div><p className="mt-1 text-[10px] text-[#8a98ad]">{policy.occupancy}</p></td><td className="px-3 py-4 text-[11px] text-[#5f708c]">{policy.expiry}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${policy.premiumStatus === 'Received' ? 'bg-[#eaf6f1] text-[#26805f]' : 'bg-[#fff3df] text-[#aa721d]'}`}>{policy.premiumStatus}</span></td></tr>)}</tbody></table></div><div className="flex items-center justify-between px-5 py-4"><p className="text-[11px] text-[#9aa6ba]">Showing {filtered.length} of {policies.length} policies</p><button className="text-[11px] font-semibold text-[#3d65b2]">View all policies →</button></div></section>
            <section className="rounded-xl border border-[#e4e9f2] bg-white"><div className="border-b border-[#eef1f6] px-5 py-5"><h3 className="text-[14px] font-semibold">Upcoming actions</h3><p className="mt-1 text-[11px] text-[#8b98ad]">Your next deadlines, in one place.</p></div><div className="flex flex-col gap-1 p-3"><Action icon={CalendarDays} title="Renewal due in 30 days" sub="Coastal Energy Partners · NR-2025-0098" tone="blue" /><Action icon={Mail} title="Premium receipt follow-up" sub="Meridian Hospitality Group · $127,500" tone="orange" /><Action icon={Bell} title="Send renewal reminder" sub="Greenline Logistics · 22 Nov 2026" tone="purple" /></div><div className="mx-5 mb-5 mt-3 rounded-lg bg-[#f7f9fc] p-3.5"><p className="text-[11px] font-semibold text-[#3d4e6b]">Tip: automate the routine</p><p className="mt-1 text-[11px] leading-5 text-[#8a98ad]">Set a reminder template once and Northstar will prepare your Outlook message for you.</p><button className="mt-2 text-[10px] font-bold text-[#3d65b2]">Configure templates →</button></div></section></div>
          <div className="mt-5 grid gap-5 md:grid-cols-3"><ReportCard icon={FileBarChart} title="Production report" desc="Premium by cedant, market and class." /><ReportCard icon={CalendarDays} title="Renewal pipeline" desc="Upcoming expiry and placement status." /><ReportCard icon={FileSpreadsheet} title="Outstanding premium" desc="Aged receipts ready to follow up." /></div>
        </div>
      </section>
      {showForm && <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#14213d]/30 p-4"><div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-[#eef1f6] p-6"><div><h3 className="text-lg font-semibold">Add new policy</h3><p className="mt-1 text-xs text-[#8b98ad]">Market fit updates automatically from the risk details.</p></div><button onClick={() => setShowForm(false)} className="text-[#8b98ad]"><X className="size-5" /></button></div><div className="grid gap-4 p-6 sm:grid-cols-2"><Field label="Policy number" value={form.number} onChange={(v) => setForm({ ...form, number: v })} placeholder="NR-2026-0043" /><Field label="Cedant" value={form.cedant} onChange={(v) => setForm({ ...form, cedant: v })} placeholder="Company name" /><Field label="Occupancy / class" value={form.occupancy} onChange={(v) => setForm({ ...form, occupancy: v })} placeholder="e.g. Construction" /><Field label="Premium (USD)" value={form.premium} onChange={(v) => setForm({ ...form, premium: v })} placeholder="250000" type="number" /><Field label="Sum insured (USD)" value={form.sumInsured} onChange={(v) => setForm({ ...form, sumInsured: v })} placeholder="10000000" type="number" /><Field label="Expiry date" value={form.expiry} onChange={(v) => setForm({ ...form, expiry: v })} placeholder="30 Jun 2027" /><div className="rounded-lg bg-[#f0f5ff] p-3 sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#71809a]">Suggested market</p><p className="mt-1 text-sm font-semibold text-[#31599c]">{marketFor(form.occupancy, Number(form.sumInsured) || 0)}</p></div></div><div className="flex justify-end gap-2 border-t border-[#eef1f6] p-5"><button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-xs font-semibold text-[#71809a]">Cancel</button><button onClick={savePolicy} className="rounded-lg bg-[#203b73] px-4 py-2 text-xs font-semibold text-white">Save policy</button></div></div></div>}{saved && <div className="fixed bottom-5 right-5 z-40 rounded-xl bg-[#173b34] px-4 py-3 text-xs font-medium text-white shadow-xl">Policy saved successfully and market fit assigned.</div>}
    </main>
  )
}

function Stat({ icon: Icon, label, value, note, positive = false }: { icon: typeof BriefcaseBusiness; label: string; value: string; note: string; positive?: boolean }) { return <div className="rounded-xl border border-[#e4e9f2] bg-white p-5"><div className="flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-lg bg-[#edf2fb] text-[#3d65b2]"><Icon className="size-4" /></div>{positive && <span className="text-[10px] font-semibold text-[#2b8a68]">↗ 8.4%</span>}</div><p className="mt-5 text-[11px] text-[#8b98ad]">{label}</p><p className="mt-1 text-[22px] font-semibold tracking-[-0.04em]">{value}</p><p className={`mt-2 text-[10px] ${positive ? 'text-[#2b8a68]' : 'text-[#a2752c]'}`}>{note}</p></div> }
function Action({ icon: Icon, title, sub, tone }: { icon: typeof Bell; title: string; sub: string; tone: string }) { return <div className="flex items-start gap-3 rounded-lg p-3 hover:bg-[#fafbfd]"><div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tone === 'orange' ? 'bg-[#fff3df] text-[#ad7623]' : tone === 'purple' ? 'bg-[#f1edff] text-[#7659c5]' : 'bg-[#eaf2ff] text-[#3d65b2]'}`}><Icon className="size-4" /></div><div><p className="text-[11px] font-semibold text-[#3d4e6b]">{title}</p><p className="mt-1 text-[10px] leading-4 text-[#94a0b2]">{sub}</p></div><ChevronDown className="ml-auto mt-1 size-3 rotate-[-90deg] text-[#b4bdca]" /></div> }
function ReportCard({ icon: Icon, title, desc }: { icon: typeof FileBarChart; title: string; desc: string }) { return <button className="flex items-center gap-4 rounded-xl border border-[#e4e9f2] bg-white p-4 text-left transition hover:border-[#b9c9e5] hover:shadow-sm"><div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f4fb] text-[#3d65b2]"><Icon className="size-[18px]" /></div><div><p className="text-[12px] font-semibold">{title}</p><p className="mt-1 text-[10px] text-[#8b98ad]">{desc}</p></div><Upload className="ml-auto size-4 rotate-180 text-[#aab5c5]" /></button> }
function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) { return <label className="flex flex-col gap-1.5"><span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7f8da3]">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 rounded-lg border border-[#dfe5ef] px-3 text-xs outline-none transition focus:border-[#6687c4] focus:ring-2 focus:ring-[#dce7fb] placeholder:text-[#b0b9c8]" /></label> }
