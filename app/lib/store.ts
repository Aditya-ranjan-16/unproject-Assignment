import { MutableRefObject } from "react";

import { create } from "zustand";
import * as THREE from 'three'
export type ModelMaterial={
    name:string
    node:string
    material:THREE.MeshStandardMaterial | THREE.Material
}

export type ModelMaterialStore={
    materials:ModelMaterial[]
}
export type ModelMaterialStoreActions={
    addMaterial:(material:ModelMaterial)=>void
    removeallMaterials:()=>void
    updateMaterial:(material:ModelMaterial)=>void
}
export const useMaterialStore = create<ModelMaterialStore &  ModelMaterialStoreActions>()((set)=>({
    materials:[],
    addMaterial:(material:ModelMaterial)=>{
        const exists=useMaterialStore.getState().materials.find((m)=>m.name===material.name)
        if(exists) return 
        set((state)=>({
            materials:[...state.materials,material]
        }))
    },
    updateMaterial:(material:ModelMaterial)=>{
        set((state)=>({
            materials:state.materials.map((m)=>m.name===material.name?material:m)
        }))
    },
    removeallMaterials:()=>{
        set({materials:[]})
    }

}))

type ModelRefStore={
    globalRef:MutableRefObject<THREE.Group<THREE.Object3DEventMap>>
    setGlobalRef:(ref:MutableRefObject<THREE.Group<THREE.Object3DEventMap>>)=>void
}
export const useGlobalRefStore = create<ModelRefStore>((set) => ({
  globalRef: null,
  setGlobalRef: (ref:MutableRefObject<THREE.Group<THREE.Object3DEventMap>>) => set({ globalRef: ref }),
}));