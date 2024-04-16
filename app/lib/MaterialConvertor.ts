import { MeshPhysicalMaterial, MeshStandardMaterial } from "three"

export const StandardToPhysicalMaterial = (material: MeshStandardMaterial): MeshStandardMaterial => {
    delete material._listeners
    return material
    }

    export const PhysicalToStandardMaterial = (material: MeshPhysicalMaterial): MeshPhysicalMaterial => {
    delete material.isMeshPhysicalMaterial
    delete material.anisotropyRotation
    delete material.anisotropyMap
    delete material.clearcoatMap
    delete material.clearcoatRoughness
    delete material.clearcoatRoughnessMap
    delete material.clearcoatNormalScale
    delete material.clearcoatNormalMap
    delete material.ior
    delete material.iridescenceMap
    delete material.iridescenceIOR
    delete material.iridescenceThicknessRange
    delete material.iridescenceThicknessMap
    delete material.sheenColor
    delete material.sheenColorMap
    delete material.sheenRoughness
    delete material.sheenRoughnessMap
    delete material.transmissionMap
    delete material.thickness
    delete material.thicknessMap
    delete material.attenuationDistance
    delete material.attenuationColor
    delete material.specularIntensity
    delete material.specularIntensityMap
    delete material.specularColorMap
    delete material.specularColor
    delete material._anisotropy
    delete material._clearcoat
    delete material._iridescence
    delete material._sheen
    delete material._transmission
    delete material._listeners
    return material
    }