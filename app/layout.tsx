import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import Script from 'next/script'
export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
        <Script src='assets/draco_encoder.js'></Script>
        <Script src='assets/draco_decoder.js'></Script>
      </body>
    </html>
  )
}
