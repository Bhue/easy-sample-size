import './globals.css'
import React from 'react'
import { TelemetryConsent } from '../components/TelemetryConsent'

export const metadata = {
  title: 'Easy Sample Size',
  description: 'G*Power-style power and sample-size calculators',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg">Easy Sample Size</a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/calculators" className="hover:underline">Calculators</a>
              <a href="/wizard" className="hover:underline">Wizard</a>
              <a href="/glossary" className="hover:underline">Glossary</a>
              <a href="/about" className="hover:underline">About</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <TelemetryConsent />
        <footer className="mt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">© {new Date().getFullYear()} Easy Sample Size</div>
        </footer>
      </body>
    </html>
  )
}
