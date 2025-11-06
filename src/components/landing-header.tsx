"use client"

import { ThemeToggle } from "./theme-toggle"

export function LandingHeader() {
  return (
    <>
      {/* Skip to content link - appears on Tab */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>
      
      <header className="w-full flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">World Clock & Weather</h1>
          <p className="text-muted-foreground text-lg">Real-time weather and time across major cities</p>
        </div>
        <ThemeToggle />
      </header>
    </>
  )
}
