import React from "react"
import type { ViewId } from "@/types/view"
import { Topbar } from "@/components/layout/Topbar"

interface AppShellProps {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  children,
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar currentView={currentView} onNavigate={onNavigate} />
      <main className="flex-1 px-4 py-4 md:px-8" aria-live="polite">
        {children}
      </main>
    </div>
  )
}
