export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Topbar } from '@/components/layout/topbar'
import { DespachosTable } from './despachos-table'

export default async function DespachosPage() {
  const { data } = await supabase
    .from('agencia_despachos')
    .select('*')
    .order('despacho_id', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Despachos" subtitle={`${data?.length ?? 0} registros`} />
      <main className="flex-1 p-6 overflow-auto">
        <DespachosTable data={data ?? []} />
      </main>
    </div>
  )
}
