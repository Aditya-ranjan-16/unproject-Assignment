'use client'

import { ModelMaterial, useGlobalRefStore, useMaterialStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { Color } from 'three'
import MaterialPane from './MaterialPane'

export default function MaterialPanel() {
  const [materialPane, setMaterialPane] = useState(false)
  const materials = useMaterialStore((state) => state.materials)
  const [curretMaterial, setCurretMaterial] = useState<number>(0)
  const globalref = useGlobalRefStore((state) => state.globalRef)

  const togglePane = (index: number) => {
    if (curretMaterial !== index) {
      setCurretMaterial(index)
      setMaterialPane(true)
    } else {
      setMaterialPane((prev) => !prev)
    }
  }
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = new Color(e.target.value)
    // curretMaterial.material.color = color
    // useMaterialStore.getState().updateMaterial(curretMaterial)
  }
  useEffect(() => {
    console.log(materials)
    setCurretMaterial(materials[0])
  }, [materials, globalref])

  return (
    <>
      <div className='z-10 w-[20%] top-[20%] h-[50vh] right-4 bg-slate-500 text-white absolute'>
        {materials.map((val: ModelMaterial, i) => {
          const color = new Color(globalref.current.children[i].material.color).getHexString()
          return (
            <div
              key={i}
              onClick={() => togglePane(i)}
              className='group flex items-center gap-2 p-2 cursor-pointer justify-start'
            >
              <div
                style={{ backgroundColor: `#${color}` }}
                className={`w-4 h-4 first-child-div group-hover:border-2 border-black rounded-full`}
              ></div>
              <div>
                {val.name}
                <span className='text-gray-700'>{`- [${val.node}]`}</span>
              </div>
            </div>
          )
        })}
      </div>
      {materialPane && <MaterialPane key={curretMaterial} currentMaterial={curretMaterial} />}
    </>
  )
}
