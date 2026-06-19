import { useState } from 'react'
import { StorePage } from './pages/StorePage'
import { AdminPage } from './pages/AdminPage'
import { PinGate } from './components/admin/PinGate'

type Vista = 'tienda' | 'pin' | 'admin'

export default function App() {
  const [vista, setVista] = useState<Vista>('tienda')
  return (
    <>
      {vista === 'tienda' && <StorePage onAdminTrigger={() => setVista('pin')} />}
      {vista === 'pin' && <PinGate onSuccess={() => setVista('admin')} onCancel={() => setVista('tienda')} />}
      {vista === 'admin' && <AdminPage onExit={() => setVista('tienda')} />}
    </>
  )
}
