import { Archivo } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ContextManager } from '@/providers/ContextManager'

const archivo = Archivo({ subsets: ['latin'] })

export const metadata = {
  title: 'Digital Diode',
  description: 'Decentralized Identity, Ownership, and Data Exchange',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={archivo.className}>
        <ContextManager>
          <Navigation />
          {children}
          <Footer />
        </ContextManager>
      </body>
    </html>
  )
}
