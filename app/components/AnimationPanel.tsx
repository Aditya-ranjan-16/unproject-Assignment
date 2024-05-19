'use client'

import { useGlobalAnimationStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function AnimationPanel() {
  const animations = useGlobalAnimationStore((state) => state.animations)
  const globalAnimRef = useGlobalAnimationStore((state) => state.globalAnimRef)
  const [progress, setProgress] = useState(0)
  const [currentAnim, setCurrentAnim] = useState(0)
  useEffect(() => {
    const action = globalAnimRef[animations[currentAnim]]
    if (action === undefined) return
    action.reset()
    action.fadeIn(0.5)

    action.play()
    const interval = setInterval(() => {
      if (action.isRunning()) {
        const duration = action.getClip().duration
        const time = action.time
        setProgress((time / duration) * 100)
      } else {
        clearInterval(interval)
      }
    }, 100) // Update every 100ms

    return () => {
      clearInterval(interval)
      action.stop()
    }
  }, [animations, globalAnimRef, currentAnim])

  const onAnimclick = (index: number) => {
    setCurrentAnim(index)
  }
  return (
    <>
      {animations.length !== 0 && (
        <div className='z-10 w-[20%] overflow-y-scroll top-[20%] h-[50vh] left-4 bg-slate-500 text-white absolute'>
          {progress.toFixed(1) + '%'}
          {animations.map((val, i) => {
            return (
              <div
                key={val}
                onClick={() => onAnimclick(i)}
                className='group flex items-center gap-2 p-2 cursor-pointer justify-start'
              >
                <div className='text-white'>{val}</div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
