import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { db, policies } from '@/lib/db'

export async function GET() {
  const rows = await db.select().from(policies).orderBy(desc(policies.createdAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.policyNumber || !body.cedant || !body.occupancy) return NextResponse.json({ error: 'Policy number, cedant and occupancy are required.' }, { status: 400 })
  const [created] = await db.insert(policies).values({
    policyNumber: String(body.policyNumber), cedant: String(body.cedant), broker: 'Northstar Re',
    premium: String(Number(body.premium) || 0), sumInsured: String(Number(body.sumInsured) || 0), currency: 'USD',
    occupancy: String(body.occupancy), market: String(body.market || 'Pending review'), inceptionDate: body.inceptionDate || new Date().toISOString().slice(0, 10),
    expiryDate: body.expiryDate || new Date(Date.now() + 31536000000).toISOString().slice(0, 10), status: 'Active', premiumStatus: 'Outstanding', notes: body.notes || null,
  }).returning()
  return NextResponse.json(created, { status: 201 })
}
