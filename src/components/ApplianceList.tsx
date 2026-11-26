import { useEffect, useState } from 'react'
import type { Appliance } from '../core/types'
import { useStore } from '../state/store'
import type { ListKey } from '../state/model'
import { useI18n } from '../i18n'
import { ApplianceCard } from './ApplianceCard'
import { AddApplianceSheet } from './AddApplianceSheet'

/** Editable list of appliances. Used for "Current" now, and "What-if" in Compare. */
export function ApplianceList({ list }: { list: ListKey }) {
  const { data, dispatch } = useStore()
  const { t } = useI18n()
  const items = data[list]
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [lastDeleted, setLastDeleted] = useState<{ item: Appliance; index: number } | null>(null)

  // Hide the "Undo" bar after a few seconds.
  useEffect(() => {
    if (!lastDeleted) return
    const timer = setTimeout(() => setLastDeleted(null), 5000)
    return () => clearTimeout(timer)
  }, [lastDeleted])

  const remove = (item: Appliance) => {
    setLastDeleted({ item, index: items.findIndex((a) => a.id === item.id) })
    dispatch({ type: 'remove', list, id: item.id })
    setEditingId(null)
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-2xl bg-surface p-4 text-muted">{t.emptyList}</p>}

      {items.map((item) => (
        <ApplianceCard
          key={item.id}
          item={item}
          tariff={data.tariff}
          editing={editingId === item.id}
          onToggleEdit={() => setEditingId(editingId === item.id ? null : item.id)}
          onChange={(patch) => dispatch({ type: 'update', list, id: item.id, patch })}
          onDelete={() => remove(item)}
        />
      ))}

      <button
        onClick={() => setAdding(true)}
        className="w-full rounded-2xl border-2 border-dashed border-line py-4 text-lg font-semibold text-accent active:bg-surface"
      >
        + {t.addAppliance}
      </button>

      {adding && (
        <AddApplianceSheet
          onClose={() => setAdding(false)}
          onAdd={(item, openEditor) => {
            dispatch({ type: 'add', list, item })
            setAdding(false)
            if (openEditor) setEditingId(item.id)
          }}
        />
      )}

      {lastDeleted && (
        <div className="fixed inset-x-4 bottom-24 z-10 mx-auto flex max-w-md items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 shadow-lg">
          <span className="truncate">{t.deleted}: {lastDeleted.item.name}</span>
          <button
            onClick={() => {
              dispatch({ type: 'add', list, item: lastDeleted.item, index: lastDeleted.index })
              setLastDeleted(null)
            }}
            className="ml-3 shrink-0 rounded-lg px-3 py-1.5 font-semibold text-accent active:bg-surface"
          >
            {t.undo}
          </button>
        </div>
      )}
    </div>
  )
}
