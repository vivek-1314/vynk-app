// hooks/useLenis.ts
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      // duration: 0.2,
       easing: (t: number) => {
        const eased =  t
        console.log('easing input:', t, '| output:', eased)
        return eased
      }
    })
    // let frameId: number

    const raf = (time: number) => {
      lenis.raf(time)
      // frameId = requestAnimationFrame(raf)
    }

    // frameId = requestAnimationFrame(raf)

    return () => {
      // cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])
}
