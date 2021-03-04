import {
  caseFitsCpuCooler,
  caseFitsGpu,
  caseFitsMotherboard,
  caseFitsPowersupply,
  cpuSupportsCooler,
} from '@/lib/buildValidationRules'
import BuildModel from '@/models/Build.model'

describe('Build Validation Rules', () => {
  describe('Case Fits Cpu Cooler', () => {
    it('returns true if no case or cpu cooler exists in build', () => {
      expect(caseFitsCpuCooler(new BuildModel({}))).toBe(true)
    })

    it('returns true if the case supports the cpu cooler length', () => {
      const buildWithCoolerSmallerLength = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthCpuFan: 200 },
          { type: 'CPU Cooler', isBeingKept: true, length: 100 },
        ],
      })

      const buildWithCoolerSameLength = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthCpuFan: 200 },
          { type: 'CPU Cooler', isBeingKept: true, length: 200 },
        ],
      })

      expect(caseFitsCpuCooler(buildWithCoolerSmallerLength)).toBe(true)
      expect(caseFitsCpuCooler(buildWithCoolerSameLength)).toBe(true)
    })

    it('returns an error if the case does not support the cpu cooler length', () => {
      const build = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthCpuFan: 200 },
          { type: 'CPU Cooler', isBeingKept: true, length: 201 },
        ],
      })

      expect(caseFitsCpuCooler(build)).not.toBe(true)
    })
  })

  describe('Case Fits GPU', () => {
    it('returns true if not case or GPU exists in the build', () => {
      expect(caseFitsGpu(new BuildModel({}))).toBe(true)
    })

    it('returns true if the case supports the GPU length', () => {
      const buildWithGpuSmallerLength = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthGpu: 200 },
          { type: 'GPU', isBeingKept: true, length: 100 },
        ],
      })

      const buildWithGpuSameLength = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthGpu: 200 },
          { type: 'GPU', isBeingKept: true, length: 200 },
        ],
      })

      expect(caseFitsGpu(buildWithGpuSmallerLength)).toBe(true)
      expect(caseFitsGpu(buildWithGpuSameLength)).toBe(true)
    })

    it('returns an error if the case does not support the GPU length', () => {
      const build = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthGpu: 200 },
          { type: 'GPU', isBeingKept: true, length: 201 },
        ],
      })

      expect(caseFitsGpu(build)).not.toBe(true)
    })

    it('returns true if two GPUs and both lengths are supported', () => {
      const buildWithTwoGpus = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthGpu: 200 },
          { type: 'GPU', isBeingKept: true, length: 100 },
          { type: 'GPU', isBeingKept: true, length: 199 },
        ],
      })

      expect(caseFitsGpu(buildWithTwoGpus)).toBe(true)
    })

    it('returns an error if two GPUs and one length is not supported', () => {
      const buildWithTwoGpus = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, maxLengthGpu: 200 },
          { type: 'GPU', isBeingKept: true, length: 100 },
          { type: 'GPU', isBeingKept: true, length: 201 },
        ],
      })

      expect(caseFitsGpu(buildWithTwoGpus)).not.toBe(true)
    })
  })

  describe('Case Fits Motherboard', () => {
    it('returns true if no case or motherboard exists in the build', () => {
      expect(caseFitsMotherboard(new BuildModel({}))).toBe(true)
    })

    it('returns true if the case supports the motherboard size', () => {
      const build = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, supportedMotherboards: ['S-ATX'] },
          { type: 'Motherboard', isBeingKept: true, sizeType: 'S-ATX' },
        ],
      })

      expect(caseFitsMotherboard(build)).toBe(true)
    })

    it('returns false if the case does not support the motherboard size', () => {
      const build = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, supportedMotherboards: ['E-ATX'] },
          { type: 'Motherboard', isBeingKept: true, sizeType: 'S-ATX' },
        ],
      })

      expect(caseFitsMotherboard(build)).not.toBe(true)
    })
  })

  describe('Case Fits Powersupply', () => {
    it('returns true if no case or powersupply exists in the build', () => {
      expect(caseFitsPowersupply(new BuildModel({}))).toBe(true)
    })

    it('returns true if the case supports the powersupply size', () => {
      const build = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, supportedPowersupplies: ['ATX'] },
          { type: 'Power Supply', isBeingKept: true, sizeType: 'ATX' },
        ],
      })

      expect(caseFitsPowersupply(build)).toBe(true)
    })

    it('returns false if the case does not support the powersupply size', () => {
      const build = new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, supportedPowersupplies: ['ATX'] },
          { type: 'Power Supply', isBeingKept: true, sizeType: 'SFX' },
        ],
      })

      expect(caseFitsPowersupply(build)).not.toBe(true)
    })
  })

  describe('Cpu Supports Cooler', () => {
    it('returns true if no cpu or cpu cooler exists in the build', () => {
      expect(cpuSupportsCooler(new BuildModel({}))).toBe(true)
    })

    it('returns true if the cpu supports the cooler', () => {
      const build = new BuildModel({
        parts: [
          { type: 'CPU', isBeingKept: true, socket: 'AM4' },
          { type: 'CPU Cooler', isBeingKept: true, supportedCpus: ['AM4'] },
        ],
      })

      expect(cpuSupportsCooler(build)).toBe(true)
    })

    it('returns false if the cpu does not support the cooler', () => {
      const build = new BuildModel({
        parts: [
          { type: 'CPU', isBeingKept: true, socket: 'AM4' },
          { type: 'CPU Cooler', isBeingKept: true, supportedCpus: ['LGA 1151 (Skylake)'] },
        ],
      })

      expect(cpuSupportsCooler(build)).not.toBe(true)
    })
  })
})
