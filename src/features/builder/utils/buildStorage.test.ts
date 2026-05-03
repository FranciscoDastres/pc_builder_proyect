import { describe, expect, it } from 'vitest'
import { cases, cpus, gpus, motherboards, psus, rams, storages, coolers } from '../../../data/products'
import type { SelectedBuild } from '../../../types'
import {
  createBuildShareUrl,
  decodeBuildSelection,
  encodeBuildSelection,
  restoreBuildSelection,
  serializeBuildSelection,
} from './buildStorage'

const emptyBuild: SelectedBuild = {
  case: null,
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null,
  storage: null,
  cooler: null,
}

describe('buildStorage', () => {
  it('serializes selected products by slot and id', () => {
    const build: SelectedBuild = {
      ...emptyBuild,
      case: cases[0],
      cpu: cpus[0],
      gpu: gpus[0],
    }

    expect(serializeBuildSelection(build)).toEqual({
      case: cases[0].id,
      cpu: cpus[0].id,
      gpu: gpus[0].id,
    })
  })

  it('restores only products that still exist in the correct slot', () => {
    const restored = restoreBuildSelection(
      {
        case: cases[0].id,
        cpu: cpus[0].id,
        motherboard: cpus[0].id,
        ram: 'missing-product',
      },
      [cases[0], cpus[0], motherboards[0], rams[0], gpus[0], psus[0], storages[0], coolers[0]],
      emptyBuild,
    )

    expect(restored?.case?.id).toBe(cases[0].id)
    expect(restored?.cpu?.id).toBe(cpus[0].id)
    expect(restored?.motherboard).toBeNull()
    expect(restored?.ram).toBeNull()
  })

  it('encodes and decodes build selections for shareable URLs', () => {
    const encoded = encodeBuildSelection({
      case: cases[0].id,
      cpu: 'cpu:with-special/id',
      ram: '',
    })

    expect(decodeBuildSelection(encoded)).toEqual({
      case: cases[0].id,
      cpu: 'cpu:with-special/id',
    })
  })

  it('creates a URL with the current build selection', () => {
    const build: SelectedBuild = {
      ...emptyBuild,
      case: cases[0],
      cpu: cpus[0],
    }

    const url = createBuildShareUrl(build, 'http://localhost:5173/?foo=bar')

    expect(url).toContain('foo=bar')
    expect(url).toContain('build=')
    expect(decodeBuildSelection(new URL(url).searchParams.get('build'))).toEqual({
      case: cases[0].id,
      cpu: cpus[0].id,
    })
  })
})
