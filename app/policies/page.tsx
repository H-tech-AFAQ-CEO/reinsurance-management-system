'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { EmptyState, Metric, Panel, Status, WorkspacePage } from '@/components/workspace-page'

type Policy = { id: string; policyNumber: string; cedant: string; occupancy: string; premium: string; sumInsured: string; market: string; expiryDate: string; premiumStatus: string; status: string }
const money = (value: string | number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value))

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [query, setQuery] = useState('')
  useEffect(() => { fetch('/api/policies').then((r) => r.ok ? r.json() : []).then(setPolicies).catch(() => setPolicies([])) }, [])
  const filtered = useMemo(() => policies.filter((p) => `${p.policyNumber} ${p.cedant} ${p.occupancy} ${p.market}`.toLowerCase().includes(query.toLowerCase())), [policies, query])
  const premium = policies.reduce((total, p) => total + Number(p.premium), 0)
  return <WorkspacePage active="Policies" eyebrow="Portfolio management" title="Policies" description="Review every placement, market assignment, premium status, and renewal date.">
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Total policies" value={String(policies.length)} note="Live from Neon" /><Metric label="Gross premium" value={money(premium)} note="Across active book" /><Metric label="Outstanding accounts" value={String(policies.filter((p) => p.premiumStatus !== 'Received').length)} note="Follow-up required" /></div>
    <Panel title="Policy register" description="The live policy register for Afaq Ahmad's demo workspace."><div className="mb-5 flex h-10 max-w-sm items-center gap-2 rounded-lg border border-[#e4e9f2] px-3"><Search className="size-4 text-[#9aa6ba]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search policies, cedants or markets" className="w-full bg-transparent text-xs outline-none" /></div>{filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-[#eef1f6] text-[10px] uppercase tracking-[0.1em] text-[#9aa6ba]"><th className="px-2 py-3">Policy / cedant</th><th className="px-2 py-3">Class</th><th className="px-2 py-3">Premium</th><th className="px-2 py-3">Market fit</th><th className="px-2 py-3">Expiry</th><th className="px-2 py-3">Status</th></tr></thead><tbody>{filtered.map((p) => <tr key={p.id} className="border-b border-[#f2f4f7] last:border-0"><td className="px-2 py-4"><p className="text-xs font-semibold">{p.policyNumber}</p><p className="mt-1 text-[11px] text-[#8b98ad]">{p.cedant}</p></td><td className="px-2 py-4 text-xs text-[#596a84]">{p.occupancy}</td><td className="px-2 py-4 text-xs font-medium">{money(p.premium)}<p className="mt-1 text-[10px] text-[#8b98ad]">{p.premiumStatus}</p></td><td className="px-2 py-4 text-xs font-medium text-[#3d65b2]"><Sparkles className="mr-1 inline size-3" />{p.market}</td><td className="px-2 py-4 text-xs text-[#596a84]">{new Date(p.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td className="px-2 py-4"><Status tone="green">{p.status}</Status></td></tr>)}</tbody></table></div> : <EmptyState title="No policies found" body="Add a policy from the overview page or adjust your search." />}</Panel>
  </WorkspacePage>
}
