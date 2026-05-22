export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Topbar } from '@/components/layout/topbar'
import { TransportistasTable } from './transportistas-table'

export default async function TransportistasPage() {
  const { data } = await supabase
    .from('agencia_transportistas')
    .select('*')
    .order('transportista_id')

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Transportistas" subtitle={`${data?.length ?? 0} registros`} />
      <main className="flex-1 p-6 overflow-auto">
        <TransportistasTable data={data ?? []} />
      </main>
    </div>
  )
}
