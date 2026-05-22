interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded font-mono">
          AGENCIA_DISTRIBUIDORA
        </span>
      </div>
    </header>
  )
}
