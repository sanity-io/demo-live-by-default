import '../globals.css'

import {Inter} from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body>
        <section className="min-h-screen">
          <main>{children}</main>
        </section>
      </body>
    </html>
  )
}
