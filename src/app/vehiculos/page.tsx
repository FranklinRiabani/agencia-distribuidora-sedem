export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { Topbar } from '@/components/layout/topbar'
import { VehiculosTable } from './vehiculos-table'

export default async function VehiculosPage() {
  const { data } = await supabase
    .from('agencia_vehiculos')
    .select('*')
    .order('vehiculo_id')

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Vehículos" subtitle={`${data?.length ?? 0} registros`} />
      <main className="flex-1 p-6 overflow-auto">
        <VehiculosTable data={data ?? []} />
      </main>
    </div>
  )
}
