export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Topbar } from '@/components/layout/topbar'
import { AlmacenesTable } from './almacenes-table'

export default async function AlmacenesPage() {
  const { data } = await supabase
    .from('agencia_almacenes')
    .select('*')
    .order('almacen_id')

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Almacenes" subtitle={`${data?.length ?? 0} registros`} />
      <main className="flex-1 p-6 overflow-auto">
        <AlmacenesTable data={data ?? []} />
      </main>
    </div>
  )
}
