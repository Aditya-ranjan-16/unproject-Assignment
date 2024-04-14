import { useMaterialStore, useModelPaneStore } from '@/lib/store'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Color, Material, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from 'three'
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})

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
export default function MaterialPane({ currentMaterial }: { currentMaterial: number }) {
  const sphereRef = useRef<Mesh>()
  const [color, setColor] = useState<string>('#000000')
  const [opacity, setOpacity] = useState<number>(1.0)
  const materials = useMaterialStore((state) => state.materials)
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(currentMaterial)
    setColor(e.target.value)
    materials[currentMaterial].material.setValues({ color: new Color(e.target.value) })
    sphereRef.current.material.setValues({ color: new Color(e.target.value) })
  }
  const handleOpacityChange = (event) => {
    const opacity = parseFloat(event.target.value)
    setOpacity(opacity)
    materials[currentMaterial].material.setValues({ opacity: opacity })
  }
  useEffect(() => {
    if (materials[currentMaterial]) {
      const defColor = new Color(materials[currentMaterial].material.color).getHexString()
      setColor(`#${defColor}`)
      setOpacity(materials[currentMaterial].material.opacity)
      if (sphereRef.current) {
        sphereRef.current.material.setValues({
          color: new Color(materials[currentMaterial].material.color),
          map: materials[currentMaterial].material.map,
        })
        sphereRef.current.material.needsUpdate = true
      }
    }
  }, [currentMaterial, materials])

  return (
    <>
      {materials[currentMaterial] ? (
        <>
          <div className='z-10  w-[15%] top-[22%] h-[5vh] right-[22%] flex flex-col items-center justify-start p-2 gap-2  bg-slate-500 text-white absolute'>
            <select className='text-black'>
              <option
                selected={materials[currentMaterial].material.type === 'MeshStandardMaterial'}
                value='MeshStandardMaterial'
              >
                Mesh Standard Material
              </option>
              <option
                selected={materials[currentMaterial].material.type === 'MeshPhysicalMaterial'}
                value='MeshPhysicalMaterial'
              >
                Mesh Physical Material
              </option>
            </select>
          </div>

          <View className='  absolute top-[27%] right-[21.9%] rounded-lg  h-[20vh] w-[15.05%]'>
            <OrbitControls enableZoom={false} enablePan={false} />
            <mesh ref={sphereRef}>
              <sphereGeometry args={[1.5, 32, 32]} />
              {materials[currentMaterial].material.type === 'MeshStandardMaterial' && <meshStandardMaterial />}
              {materials[currentMaterial].material.type === 'MeshPhysicalMaterial' && <meshPhysicalMaterial />}
            </mesh>
            <color attach='background' args={['black']} />
            <ambientLight intensity={3} />

            <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
          </View>
          <div className='z-10  w-[15%] top-[47%] h-[20vh] right-[22%] flex flex-col items-center justify-start p-2 gap-2  bg-slate-500 text-white absolute'>
            <div className='flex w-full px-4 items-center justify-between'>
              <div>Color</div>
              <input value={color} onChange={handleColorChange} type='color' />
            </div>
            <div>Opacity</div>
            <div className='flex w-full px-4 items-center justify-between'>
              <input type='range' min='0' max='1' step='0.01' value={opacity} onChange={handleOpacityChange} />
              <div>{materials[currentMaterial].material.opacity.toFixed(2)}</div>
            </div>
            {materials[currentMaterial].material.map && (
              <div className='flex w-full px-4 items-center justify-between'>
                <div>Image</div>
                <img
                  className='w-8 h-8 first-child-div border-2 border-white p-[1px] rounded-sm'
                  src={getImageUrl(materials[currentMaterial].material.map)}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  )
}
