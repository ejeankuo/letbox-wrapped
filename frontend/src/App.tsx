import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './pages/tsx/homepage.tsx'
import Page2 from './pages/tsx/page2.tsx'
import Page3 from './pages/tsx/page3.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
