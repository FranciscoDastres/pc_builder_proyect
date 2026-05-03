import { describe, expect, it } from 'vitest'
import { cases, cpus, gpus, motherboards, psus, rams, storages, coolers } from '../../../data/products'
import type { SelectedBuild } from '../../../types'
import { createBuildSummaryText, createPrintableBuildSummaryHtml } from './buildSummaryText'

describe('createBuildSummaryText', () => {
  it('creates a readable build artifact with products, totals and issues', () => {
    const build: SelectedBuild = {
      case: cases[0],
      cpu: cpus[0],
      motherboard: motherboards[0],
      ram: rams[0],
      gpu: gpus[0],
      psu: psus[0],
      storage: storages[0],
      cooler: coolers[0],
    }

    const text = createBuildSummaryText({
      build,
      totalPrice: 1234567,
      totalWatts: 820,
      catalogSource: 'fixture Alltec',
      createdAt: new Date('2026-05-03T12:00:00'),
      issues: [
        {
          slot: 'psu',
          severity: 'warning',
          message: 'Considera una fuente con mayor margen.',
        },
      ],
    })

    expect(text).toContain('Build PC Alltec')
    expect(text).toContain('Catalogo: fixture Alltec')
    expect(text).toContain('Total estimado:')
    expect(text).toContain('Gabinete:')
    expect(text).toContain(cpus[0].name)
    expect(text).toContain('VRAM:')
    expect(text).toContain('WARNING: Considera una fuente con mayor margen.')
    expect(text).toContain('precios, stock y specs deben confirmarse')
  })

  it('escapes printable HTML content', () => {
    const html = createPrintableBuildSummaryHtml('GPU <RTX> & "quote"')

    expect(html).toContain('GPU &lt;RTX&gt; &amp; &quot;quote&quot;')
    expect(html).not.toContain('GPU <RTX> & "quote"')
  })
})
