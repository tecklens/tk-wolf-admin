import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {Toaster} from '@/components/ui/toaster'
import {ThemeProvider} from '@/components/theme-provider'
import router from '@/router'
import '@/index.css'
import {TooltipProvider} from '@/components/ui/tooltip.tsx'
import AuthProvider from '@/context/auth.tsx'
import EventProvider from "@/context/event.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <EventProvider>
            <RouterProvider router={router}/>
          </EventProvider>
        </AuthProvider>
      </TooltipProvider>
      <Toaster/>
    </ThemeProvider>
  </React.StrictMode>,
)
