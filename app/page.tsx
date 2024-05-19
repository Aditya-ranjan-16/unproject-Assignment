'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef } from 'react'
import { useState, type ChangeEvent, type DragEvent } from 'react'
import { cn } from './lib/utils'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGlobalAnimationStore, useGlobalRefStore, useMaterialStore, useModelPaneStore } from './lib/store'
import MaterialPanel from './components/MaterialPanel'
import MaterialPane from './components/MaterialPane'
import AnimationPanel from './components/AnimationPanel'

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
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

function Model({ gltf }) {
  const grpref = useRef<THREE.Group>()

  const setGlobalRef = useGlobalRefStore((state) => state.setGlobalRef)
  const setGlobalAnimRef = useGlobalAnimationStore((state) => state.setGlobalAnimRef)
  const setAnimations = useGlobalAnimationStore((state) => state.setAnimations)
  const addMaterial = useMaterialStore((state) => state.addMaterial)
  const { materials, scene, animations } = useGLTF(`${gltf}`, true)
  const { actions, names } = useAnimations(animations, scene)
  const ongroupClick = () => {
    // const findMaterialByName = (node, name) => {
    //   if (node.material && node.material.name === name) {
    //     return node.material
    //   }
    //   for (const child of node.children) {
    //     const material = findMaterialByName(child, name)
    //     if (material) return material
    //   }
    //   return null
    // }
    // const materialToChange = findMaterialByName(grpref.current, 'Screen')
    // console.log(materialToChange)
  }
  const showinfo = () => {
    console.log(grpref)
  }

  useEffect(() => {
    if (gltf) {
      if (gltf !== './cube.glb') {
        console.log('glb component rerendered')
        for (let key in materials) {
          materials[key].transparent = true
          addMaterial({
            name: key,
            material: materials[key],
          })
        }
        setGlobalRef(grpref)
        if (animations && animations.length) {
          setGlobalAnimRef(actions)
          setAnimations(names)
        }
      }
    }
  }, [gltf])

  if (gltf !== './cube.glb') {
    return (
      <group onClick={ongroupClick} onDoubleClick={showinfo}>
        <primitive object={scene} ref={grpref} />
      </group>
    )
  } else {
    return null
  }
}
export default function Page() {
  const [currentModel, setCurrentModel] = useState(null)
  const currentMaterial = useModelPaneStore((state) => state.currentMaterial)
  const togglepane = useModelPaneStore((state) => state.togglePane)
  function saveBlob(blob, fileName) {
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'

    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }
  const getNameWithoutExtension = (fileName: string): string => {
    const filename_and_extensions = fileName.split('.')
    return filename_and_extensions[filename_and_extensions.length - 2]
  }
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      if (e.target.files && e.target.files[0]) {
        let file = e.target.files[0]
        setCurrentModel(URL.createObjectURL(file))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <View orbit className='z-0 h-[100vh] w-full'>
        <Suspense fallback={null}>
          <Model gltf={currentModel ? currentModel : './cube.glb'} />
          <Common color={'#202125'} />
        </Suspense>
      </View>
      {currentModel == null && (
        <div
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          className='z-10 w-[50%]  h-[50vh] bg-black text-white absolute '
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className='flex h-full items-center bg-blue-300 w-full  justify-start'
          >
            <label
              htmlFor='dropzone-file'
              className={
                'group relative h-full flex flex-col items-center justify-center w-full aspect-video border-2 border-slate-300 border-dashed rounded-lg dark:border-gray-600 transition'
              }
            >
              <div className={cn('relative w-full h-full flex flex-col items-center justify-center')}>
                <div className='absolute inset-0 cursor-pointer' />
                <input onChange={handleChange} accept='.glb, .gltf , .fbx' id='dropzone-file' type='file' />
              </div>
            </label>
          </form>
        </div>
      )}
      {currentModel && (
        <>
          <MaterialPanel />
          <AnimationPanel />
          {togglepane && <MaterialPane currentMaterial={currentMaterial} />}
        </>
      )}
    </>
  )
}
