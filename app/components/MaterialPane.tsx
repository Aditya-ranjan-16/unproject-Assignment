import { useGlobalRefStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { Color } from 'three'

export default function MaterialPane({ currentMaterial }: { currentMaterial: number }) {
  const globalref = useGlobalRefStore((state) => state.globalRef)
  const [color, setColor] = useState<string>('')
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = new Color(e.target.value)

    globalref.current.children[currentMaterial].material.color = color

    // curretMaterial.material.color = color
    // useMaterialStore.getState().updateMaterial(curretMaterial)
  }
  useEffect(() => {
    const defColor = new Color(globalref.current.children[currentMaterial].material.color).getHexString()
    setColor(defColor)
    console.log(currentMaterial)
  }, [currentMaterial])

  return (
    <div className='z-10 w-[15%] top-[22%] h-[40vh] right-[22%] bg-slate-500 text-white absolute'>
      <input defaultValue={`red`} onChange={handleColorChange} type='color' />
    </div>
  )
}
