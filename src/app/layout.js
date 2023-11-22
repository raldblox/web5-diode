import { Archivo } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const archivo = Archivo({ subsets: ['latin'] })

export const metadata = {
  title: 'Digital Diode',
  description: 'Decentralized Identity, Ownership, and Data Exchange',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={archivo.className}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
