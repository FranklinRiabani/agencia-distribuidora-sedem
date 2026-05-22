'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Warehouse, Users, Truck, PackageCheck, Send, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/almacenes', label: 'Almacenes', icon: Warehouse },
  { href: '/transportistas', label: 'Transportistas', icon: Users },
  { href: '/vehiculos', label: 'Vehículos', icon: Truck },
  { href: '/recepciones', label: 'Recepciones', icon: PackageCheck },
  { href: '/despachos', label: 'Despachos', icon: Send },
  { href: '/docs', label: 'Documentación', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-[#1a0a0a] border-r border-[#C0392B]/20 flex flex-col">
      <div className="p-6 border-b border-[#C0392B]/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#C0392B] flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">AGENCIA</p>
            <p className="text-[#E74C3C] text-xs leading-tight">SEDEM</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-[#C0392B] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-[#C0392B]/20">
        <p className="text-xs text-gray-600 text-center">UCB · DW · 2026</p>
      </div>
    </aside>
  )
}
