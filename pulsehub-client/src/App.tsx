import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* ✅ Tailwind Test Block */}
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md mt-4">
        <h1 className="text-3xl font-bold">Tailwind is working!</h1>
        <p className="mt-2">Your frontend is now styled and ready.</p>
      </div>
    </>
  )
}

export default App

