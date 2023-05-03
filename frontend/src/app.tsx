import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import VehicleMaster from './components/vehicleMaster'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <VehicleMaster/>
    </>
  )
}
