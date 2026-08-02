import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import NewTicket from './pages/NewTicket.jsx'
import TicketDetail from './pages/TicketDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="new" element={<NewTicket />} />
          <Route path="tickets/:ticketId" element={<TicketDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
