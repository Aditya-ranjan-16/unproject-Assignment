import { MutableRefObject } from "react";

import { create } from "zustand";
import * as THREE from 'three'
export type ModelMaterial={
    name:string
    material:THREE.Material
}

export type ModelMaterialStore={
    materials:ModelMaterial[]
}
export type ModelMaterialStoreActions={
    addMaterial:(material:ModelMaterial)=>void

}
export const useMaterialStore = create<ModelMaterialStore &  ModelMaterialStoreActions>()((set)=>({
    materials:[],
    addMaterial:(material:ModelMaterial)=>{
        
        set((state)=>({
            materials:[...state.materials,material]
        }))
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