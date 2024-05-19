import { MutableRefObject } from "react";

import { create } from "zustand";
import * as THREE from 'three'

type ModelRefStore={
    globalRef:MutableRefObject<THREE.Group<THREE.Object3DEventMap>>
    setGlobalRef:(ref:MutableRefObject<THREE.Group<THREE.Object3DEventMap>>)=>void
}
export const useGlobalRefStore = create<ModelRefStore>((set) => ({
  globalRef: null,
  setGlobalRef: (ref:MutableRefObject<THREE.Group<THREE.Object3DEventMap>>) => set({ globalRef: ref }),
}));


type ModelAnimationStore={
    globalAnimRef: {
    [x: string]: THREE.AnimationAction;
}
    animations:string[]
    setAnimations:(animations:string[])=>void
    setGlobalAnimRef:(ref: {
    [x: string]: THREE.AnimationAction;
})=>void
}
export const useGlobalAnimationStore = create<ModelAnimationStore>((set) => ({
  globalAnimRef: {},
  animations:[],
  setAnimations:(animations:string[])=>set({animations}),
  setGlobalAnimRef: (ref: {
    [x: string]: THREE.AnimationAction;
}) => set({ globalAnimRef: ref }),
}));




export type ModelMaterial={
    name:string
    material:THREE.Material|THREE.MeshBasicMaterial|THREE.MeshStandardMaterial|THREE.MeshPhysicalMaterial
}

export type ModelMaterialStore={
    materials:ModelMaterial[]
}
export type ModelMaterialStoreActions={
    addMaterial:(material:ModelMaterial)=>void,
    updateMaterialByName:(name:string,material:THREE.Material)=>void
    updatetTextureByName:(name:string,texture:THREE.Texture)=>void
}
export const useMaterialStore = create<ModelMaterialStore &  ModelMaterialStoreActions>()((set)=>({
    materials:[],
    addMaterial:(material:ModelMaterial)=>{
        set((state)=>({
            materials:[...state.materials,material]
        }))
    },
    updateMaterialByName:(name:string,material:THREE.Material)=>{

        const globalRef=useGlobalRefStore.getState().globalRef
    const changeMaterialByName = (node, name) => {
      if (node.material && node.material.name === name) {
        node.material=material  
        return 
      }
      for (const child of node.children) {
        const material = changeMaterialByName(child, name)
        if (material) return material
      }
      return null
    }
        changeMaterialByName(globalRef.current,name)
        set((state)=>({
            materials:state.materials.map((m)=>{
                if(m.name===name){
                    return {...m,material}
                }
                return m
            })
        }))
    },
    updatetTextureByName:(name:string,texture:THREE.Texture)=>{
    const globalRef=useGlobalRefStore.getState().globalRef
    const changeMaterialByName = (node, name) => {
      if (node.material && node.material.name === name) {
       
        node.material.map=texture 
        node.material.needsUpdate = true 
        return node.material
      }
      for (const child of node.children) {
        const material = changeMaterialByName(child, name)
        if (material) return material
      }
      return null
    }
  changeMaterialByName(globalRef.current,name)
     
    }
}))



type ModelPaneStore={
    togglePane:boolean
    setTogglePane:(val:boolean)=>void,
    currentMaterial:number,
    setCurrentMaterial:(val:number)=>void,
}
export const useModelPaneStore = create<ModelPaneStore>((set) => ({
  togglePane:false, 
  setTogglePane:(val:boolean)=>set({togglePane:val}),
  currentMaterial:0,
  setCurrentMaterial:(val:number)=>set({currentMaterial:val})
}));

