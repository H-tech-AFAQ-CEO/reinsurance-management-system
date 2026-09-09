'use client'

import Link from 'next/link'
import { Bell, BriefcaseBusiness, CalendarDays, CircleHelp, FileBarChart, LayoutDashboard, Settings2, ShieldCheck } from 'lucide-react'

const nav = [
  ['Overview', '/', LayoutDashboard],
  ['Policies', '/policies', BriefcaseBusiness],
  ['Reminders', '/reminders', Bell],
  ['Reports', '/reports', FileBarChart],
] as const

export function WorkspacePage({ active, eyebrow, title, description, children }: { active: string; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f5f7fb] text-[#14213d]">
    <aside className="fixed inset-y-0 left-0 hidden w-[244px] border-r border-[#e4e9f2] bg-white lg:flex lg:flex-col">
      <div className="flex h-[76px] items-center gap-3 border-b border-[#eef1f6] px-7"><div className="flex size-9 items-center justify-center rounded-xl bg-[#203b73] text-white"><ShieldCheck className="size-5" /></div><span className="text-[15px] font-semibold tracking-[-0.02em]">Northstar <span className="text-[#71809a]">Re</span></span></div>
      <div className="flex flex-1 flex-col px-4 py-6"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa6ba]">Workspace</p><nav className="flex flex-col gap-1">{nav.map(([label, href, Icon]) => <Link key={label} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${active === label ? 'bg-[#edf2fb] text-[#203b73]' : 'text-[#71809a] hover:bg-[#f6f8fb]'}`}><Icon className="size-[17px]" />{label}{label === 'Reminders' && <span className="ml-auto rounded-full bg-[#e85555] px-1.5 py-0.5 text-[10px] font-bold text-white">3</span>}</Link>)}</nav><p className="px-3 pb-3 pt-9 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa6ba]">Manage</p><nav className="flex flex-col gap-1"><Link href="/settings" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${active === 'Settings' ? 'bg-[#edf2fb] text-[#203b73]' : 'text-[#71809a] hover:bg-[#f6f8fb]'}`}><Settings2 className="size-[17px]" />Settings</Link><Link href="/help" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium ${active === 'Help centre' ? 'bg-[#edf2fb] text-[#203b73]' : 'text-[#71809a] hover:bg-[#f6f8fb]'}`}><CircleHelp className="size-[17px]" />Help centre</Link></nav><div className="mt-auto rounded-xl bg-[#f1f5fc] p-4"><p className="text-[12px] font-semibold text-[#203b73]">Signed in as Afaq Ahmad</p><p className="mt-1 text-[11px] leading-5 text-[#7b8ba4]">Senior Broker · Demo workspace</p></div></div>
    </aside>
    <section className="lg:pl-[244px]"><header className="flex h-[76px] items-center justify-between border-b border-[#e4e9f2] bg-white px-5 sm:px-8"><div><p className="text-[11px] font-medium text-[#9aa6ba]">Wednesday, 9 September 2026</p><p className="mt-0.5 text-[18px] font-semibold tracking-[-0.03em]">Good morning, Afaq</p></div><div className="flex items-center gap-2 border-l border-[#e9edf3] pl-3"><div className="flex size-8 items-center justify-center rounded-full bg-[#dce6f7] text-[11px] font-bold text-[#34548f]">AA</div><div><p className="text-[12px] font-semibold">Afaq Ahmad</p><p className="text-[10px] text-[#9aa6ba]">Senior Broker</p></div></div></header><div className="mx-auto max-w-[1420px] px-5 py-7 sm:px-8"><div className="mb-7"><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#71809a]">{eyebrow}</p><h1 className="text-[28px] font-semibold tracking-[-0.045em]">{title}</h1><p className="mt-2 text-[13px] text-[#8290a7]">{description}</p></div>{children}</div></section>
  </main>
}

export function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) { return <section className="rounded-xl border border-[#e4e9f2] bg-white"><div className="border-b border-[#eef1f6] px-5 py-5"><h2 className="text-[14px] font-semibold">{title}</h2>{description && <p className="mt-1 text-[11px] text-[#8b98ad]">{description}</p>}</div><div className="p-5">{children}</div></section> }

export function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <div className="rounded-xl border border-[#e4e9f2] bg-white p-5"><p className="text-[11px] text-[#8b98ad]">{label}</p><p className="mt-2 text-[24px] font-semibold tracking-[-0.04em]">{value}</p><p className="mt-2 text-[10px] text-[#2b8a68]">{note}</p></div> }

export function Status({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'orange' | 'green' | 'purple' }) { const tones = { blue: 'bg-[#edf2fb] text-[#3d65b2]', orange: 'bg-[#fff3df] text-[#ad7623]', green: 'bg-[#edf7f2] text-[#2b8a68]', purple: 'bg-[#f1edff] text-[#7659c5]' }; return <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${tones[tone]}`}>{children}</span> }

export function EmptyState({ title, body }: { title: string; body: string }) { return <div className="rounded-lg border border-dashed border-[#dfe5ef] bg-[#fbfcfe] p-8 text-center"><p className="text-sm font-semibold text-[#3d4e6b]">{title}</p><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8b98ad]">{body}</p></div> }

export { CalendarDays }
export { BriefcaseBusiness }
export { Bell }
export { FileBarChart }
export { Settings2 }
export { CircleHelp }
