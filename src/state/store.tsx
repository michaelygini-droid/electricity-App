import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { reducer, migrate, type Action, type AppData } from './model'
import { load, save } from './storage'

const Ctx = createContext<{ data: AppData; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, () => migrate(load<unknown>('data', null)))
  useEffect(() => save('data', data), [data])
  return <Ctx.Provider value={{ data, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
