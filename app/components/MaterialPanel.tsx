'use client'

import { ModelMaterial, useMaterialStore, useModelPaneStore } from '@/lib/store'
import { useEffect } from 'react'
import { Color } from 'three'

function getImageUrl(texture: any) {
  if (texture) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = texture.image.width
    canvas.height = texture.image.height
    context.drawImage(texture.image, 0, 0)
    const url = canvas.toDataURL()
    canvas.remove()
    return url
  }
}
export default function MaterialPanel() {
  const materials = useMaterialStore((state) => state.materials)
  const togglepane = useModelPaneStore((state) => state.togglePane)
  const setTogglePane = useModelPaneStore((state) => state.setTogglePane)
  const curretMaterial = useModelPaneStore((state) => state.currentMaterial)
  const setCurretMaterial = useModelPaneStore((state) => state.setCurrentMaterial)
  const toggleMaterialPane = (index: number) => {
    if (curretMaterial !== index) {
      setCurretMaterial(index)
      setTogglePane(true)
    } else {
      setTogglePane(!togglepane)
    }
  }
  const getColorString = (index: number) => {
    const color = new Color(materials[index].material.color).getHexString()
    return color
  }
  useEffect(() => {
    // console.log(materials.length)
    // console.log('Material panel rerendered')
  }, [materials, materials[curretMaterial]])

  return (
    <>
      {materials.length !== 0 && (
        <div className='z-10 w-[20%] overflow-y-scroll top-[20%] h-[50vh] right-4 bg-slate-500 text-white absolute'>
          {materials.map((val: ModelMaterial, i) => {
            var imgsrc = ''
            if (val.material.map) {
              imgsrc = getImageUrl(val.material.map)
            }
            return (
              <div
                key={val.name}
                onClick={() => toggleMaterialPane(i)}
                className='group flex items-center gap-2 p-2 cursor-pointer justify-start'
              >
                {imgsrc === '' && (
                  <div
                    style={{ backgroundColor: `#${getColorString(i)}` }}
                    className={`w-8 h-8 first-child-div group-hover:border-2 border-white p-[1px] rounded-full`}
                  ></div>
                )}
                {imgsrc !== '' && (
                  <img
                    className='w-8 h-8 first-child-div group-hover:border-2 border-white p-[1px] rounded-full'
                    src={imgsrc}
                  />
                )}
                <div>{val.name}</div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
