'use client'

import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { useState, type ChangeEvent, type DragEvent } from 'react'
import { cn } from './lib/utils'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useMaterialStore, useModelPaneStore } from './lib/store'
import MaterialPanel from './components/MaterialPanel'
import MaterialPane from './components/MaterialPane'
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

  const addMaterial = useMaterialStore((state) => state.addMaterial)
  const { materials, scene } = useGLTF(`${gltf}`, true)
  useEffect(() => {
    if (gltf) {
      if (gltf !== './cube.glb') {
        console.log('glb component rerendered')
        for (let key in materials) {
          addMaterial({
            name: key,
            material: materials[key],
          })
        }
      }
    }
  }, [gltf])

  if (gltf !== './cube.glb') {
    return <primitive object={scene} ref={grpref} />
  } else {
    return null
  }
}
export default function Page() {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [currentModel, setCurrentModel] = useState(null)
  const currentMaterial = useModelPaneStore((state) => state.currentMaterial)
  const togglepane = useModelPaneStore((state) => state.togglePane)
  const handleDrag = (e: DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // validate file type
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)

      if (files.length !== 1) {
        alert(
          `  title: 'Invalid file type',
            description: 'Only image files are allowed.,`,
        )
      }

      const file = e.dataTransfer.files[0]

      setCurrentModel(URL.createObjectURL(file))
    }
  }
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      if (e.target.files && e.target.files[0]) {
        // at least one file has been selected

        // validate file type
        const file = e.target.files[0]
        setCurrentModel(URL.createObjectURL(file))
      }
    } catch (error) {
      // already handled
    }
  }
  useEffect(() => {
    console.log('caalled page')
  }, [])
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
            onDragEnter={handleDrag}
            className='flex h-full items-center bg-blue-300 w-full lg:w-2/3 justify-start'
          >
            <label
              htmlFor='dropzone-file'
              className={cn(
                'group relative h-full flex flex-col items-center justify-center w-full aspect-video border-2 border-slate-300 border-dashed rounded-lg dark:border-gray-600 transition',
                { 'dark:border-slate-400 dark:bg-slate-800': dragActive },
              )}
            >
              <div className={cn('relative w-full h-full flex flex-col items-center justify-center')}>
                <div
                  className='absolute inset-0 cursor-pointer'
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                />
                <input onChange={handleChange} accept='model' id='dropzone-file' type='file' />
              </div>
            </label>
          </form>
        </div>
      )}
      {currentModel && (
        <>
          <MaterialPanel />
          {togglepane && <MaterialPane currentMaterial={currentMaterial} />}
        </>
      )}
    </>
  )
}
