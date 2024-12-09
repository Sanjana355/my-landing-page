'use client'
import dynamic from 'next/dynamic'

const ProductLanding = dynamic(() => import('@/components/ProductLanding'), {
  ssr: false
})

export default function Home() {
  return <ProductLanding />
}