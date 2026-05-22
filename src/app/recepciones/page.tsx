export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Topbar } from '@/components/layout/topbar'
import { RecepcionesTable } from './recepciones-table'

export default async function RecepcionesPage() {
  const { data } = await supabase
    .from('agencia_recepciones')
    .select('*')
    .order('recepcion_id', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Recepciones" subtitle={`${data?.length ?? 0} registros`} />
      <main className="flex-1 p-6 overflow-auto">
        <RecepcionesTable data={data ?? []} />
      </main>
    </div>
  )
}
