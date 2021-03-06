import {
  caseFitsCpuCooler,
  caseFitsGpu,
  caseFitsMotherboard,
  caseFitsPowersupply,
  cpuSupportsCooler,
  gpuMultiCompatible,
  memoryIsCompatible,
  motherboardFitsCpu,
  motherboardSupportsMultiGpu,
  newPartsUnderBudget,
  psuProvidesEnoughWattage,
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

  describe('CPU Supports Cooler', () => {
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

  describe('GPU multi compatible', () => {
    it('returns true if there are 0 or 1 GPUs', () => {
      const buildNoGpus = new BuildModel()
      const buildOneGpu = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: 'SLI' },
        ],
      })

      const buildOneGpuNoMulti = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: '' },
        ],
      })

      expect(gpuMultiCompatible(buildNoGpus)).toBe(true)
      expect(gpuMultiCompatible(buildOneGpu)).toBe(true)
      expect(gpuMultiCompatible(buildOneGpuNoMulti)).toBe(true)
    })

    it('returns true if the GPUs are compatible', () => {
      const buildWithSLI = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: 'SLI' },
          { type: 'GPU', isBeingKept: true, multi: 'SLI' },
        ],
      })

      const buildWithCrossfire = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: 'CrossFire' },
          { type: 'GPU', isBeingKept: true, multi: 'CrossFire' },
        ],
      })

      expect(gpuMultiCompatible(buildWithSLI)).toBe(true)
      expect(gpuMultiCompatible(buildWithCrossfire)).toBe(true)
    })

    it('returns false if one or both of the GPUs do not support multi', () => {
      const buildOneWithoutMulti = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: 'SLI' },
          { type: 'GPU', isBeingKept: true, multi: '' },
        ],
      })

      const buildBothWithoutMulti = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: '' },
          { type: 'GPU', isBeingKept: true, multi: '' },
        ],
      })

      expect(gpuMultiCompatible(buildOneWithoutMulti)).not.toBe(true)
      expect(gpuMultiCompatible(buildBothWithoutMulti)).not.toBe(true)
    })

    it('returns false if the GPUs are not compatible', () => {
      const build = new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, multi: 'SLI' },
          { type: 'GPU', isBeingKept: true, multi: 'CrossFire' },
        ],
      })

      expect(gpuMultiCompatible(build)).not.toBe(true)
    })
  })

  describe('Memory is compatible', () => {
    const memory = {
      type: 'Memory',
      isBeingKept: true,
      manufacturer: 'company',
      sizeGb: 4,
      frequency: 1000,
      nameBase: 'lightning speed',
    }

    const memoryDiffManufacturer = {
      ...memory,
      manufacturer: 'different company',
    }

    const memoryDiffSize = {
      ...memory,
      sizeGb: 2,
    }

    const memoryDiffFrequency = {
      ...memory,
      frequency: 2000,
    }

    const memoryDiffMake = {
      ...memory,
      nameBase: 'molasses speed',
    }

    it('returns true if there are 0 or 1 memory sticks', () => {
      const buildWithNone = new BuildModel()
      const buildWithOne = new BuildModel({
        parts: [
          { ...memory },
        ],
      })

      expect(memoryIsCompatible(buildWithNone)).toBe(true)
      expect(memoryIsCompatible(buildWithOne)).toBe(true)
    })

    it('returns true if all memory sticks are compatible', () => {
      const buildWithTwo = new BuildModel({
        parts: [
          { ...memory },
          { ...memory },
        ],
      })

      const buildWithFour = new BuildModel({
        parts: [
          { ...memory },
          { ...memory },
          { ...memory },
          { ...memory },
        ],
      })

      expect(memoryIsCompatible(buildWithTwo)).toBe(true)
      expect(memoryIsCompatible(buildWithFour)).toBe(true)
    })

    it('returns false if any of the memory sticks do not match', () => {
      expect(memoryIsCompatible(new BuildModel({
        parts: [
          { ...memory },
          { ...memoryDiffFrequency },
        ],
      }))).not.toBe(true)

      expect(memoryIsCompatible(new BuildModel({
        parts: [
          { ...memory },
          { ...memoryDiffMake },
        ],
      }))).not.toBe(true)

      expect(memoryIsCompatible(new BuildModel({
        parts: [
          { ...memory },
          { ...memoryDiffManufacturer },
        ],
      }))).not.toBe(true)

      expect(memoryIsCompatible(new BuildModel({
        parts: [
          { ...memory },
          { ...memoryDiffSize },
        ],
      }))).not.toBe(true)

      expect(memoryIsCompatible(new BuildModel({
        parts: [
          { ...memoryDiffManufacturer },
          { ...memory },
          { ...memory },
        ],
      }))).not.toBe(true)
    })
  })

  describe('Motherboard Fits CPU', () => {
    it('returns true if there is no motherboard or CPU', () => {
      const buildNoParts = new BuildModel()
      const buildNoMotherboard = new BuildModel({
        parts: [{ type: 'CPU', isBeingKept: true }],
      })
      const buildNoCpu = new BuildModel({
        parts: [{ type: 'Motherboard', isBeingKept: true }],
      })

      expect(motherboardFitsCpu(buildNoParts)).toBe(true)
      expect(motherboardFitsCpu(buildNoMotherboard)).toBe(true)
      expect(motherboardFitsCpu(buildNoCpu)).toBe(true)
    })

    it('returns true if the sockets match exactly', () => {
      expect(motherboardFitsCpu(new BuildModel({
        parts: [
          { type: 'Motherboard', isBeingKept: true, socket: 'AM4' },
          { type: 'CPU', isBeingKept: true, socket: 'AM4' },
        ],
      }))).toBe(true)
    })

    it('returns true if either is kaby lake or skylake', () => {
      expect(motherboardFitsCpu(new BuildModel({
        parts: [
          { type: 'Motherboard', isBeingKept: true, socket: 'LGA 1151 (Skylake)' },
          { type: 'CPU', isBeingKept: true, socket: 'LGA 1151 (Kaby Lake)' },
        ],
      }))).toBe(true)

      expect(motherboardFitsCpu(new BuildModel({
        parts: [
          { type: 'Motherboard', isBeingKept: true, socket: 'LGA 1151 (Kaby Lake)' },
          { type: 'CPU', isBeingKept: true, socket: 'LGA 1151 (Skylake)' },
        ],
      }))).toBe(true)
    })

    it('returns false if the motherboard does not support the CPU', () => {
      expect(motherboardFitsCpu(new BuildModel({
        parts: [
          { type: 'Motherboard', isBeingKept: true, socket: 'AM4' },
          { type: 'CPU', isBeingKept: true, socket: 'LGA 1151 (Skylake)' },
        ],
      }))).not.toBe(true)
    })
  })

  describe('Motherboard supports multi GPU', () => {
    it('returns true if there is no motherboard in the build', () => {
      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'GPU' },
        ],
      }))).toBe(true)
    })

    it('returns true if there is 0 or 1 GPUs in the build', () => {
      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard' },
        ],
      }))).toBe(true)

      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard' },
          { type: 'GPU' },
        ],
      }))).toBe(true)
    })

    it('returns true if the GPU are not multi compatible or do not match', () => {
      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard' },
          { type: 'GPU', multi: '' },
          { type: 'GPU', multi: '' },
        ],
      }))).toBe(true)

      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard' },
          { type: 'GPU', multi: 'SLI' },
          { type: 'GPU', multi: 'CrossFire' },
        ],
      }))).toBe(true)
    })

    it('returns true if the motherboard supports the GPU multi option', () => {
      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard', supportsSLI: true },
          { type: 'GPU', multi: 'SLI' },
          { type: 'GPU', multi: 'SLI' },
        ],
      }))).toBe(true)

      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard', supportsCrossFire: true },
          { type: 'GPU', multi: 'CrossFire' },
          { type: 'GPU', multi: 'CrossFire' },
        ],
      }))).toBe(true)
    })

    it('returns error if the motherboard does not support the GPU multi option', () => {
      expect(motherboardSupportsMultiGpu(new BuildModel({
        parts: [
          { type: 'Motherboard', supportsCrossFire: false },
          { type: 'GPU', multi: 'CrossFire' },
          { type: 'GPU', multi: 'CrossFire' },
        ],
      }))).toBe(true)
    })
  })

  describe('New parts under budget', () => {
    it('returns true if no parts are in the build', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 10,
      }))).toBe(true)
    })

    it('returns true if no budget is in the build', () => {
      expect(newPartsUnderBudget(new BuildModel({
        parts: [
          { type: 'Case', isBeingKept: true, price: 10 },
        ],
      }))).toBe(true)
    })

    it('ignores parts that are not being kept', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 10,
        parts: [
          { type: 'Case', isBeingKept: false, price: 20 },
        ],
      }))).toBe(true)
    })

    it('ignores parts that are a part of the case', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 10,
        parts: [
          { isBeingKept: true, isPartOfCase: false, price: 20 },
        ],
      }))).toBe(true)
    })

    it('returns true if new parts are under budget', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 20,
        parts: [
          { isBeingKept: true, price: 5 },
          { isBeingKept: true, price: 10 },
        ],
      }))).toBe(true)

      expect(newPartsUnderBudget(new BuildModel({
        budget: 20,
        parts: [
          { isBeingKept: true, price: 5 },
          { isBeingKept: true, price: 15 },
        ],
      }))).toBe(true)
    })

    it('returns true if used parts are under budget', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 50,
        parts: [
          { isBeingKept: true, isNewUsedPart: true, price: 36 },
          { isBeingKept: true, isNewUsedPart: true, price: 72 },
        ],
      }))).toBe(true)

      expect(newPartsUnderBudget(new BuildModel({
        budget: 45,
        parts: [
          { isBeingKept: true, isNewUsedPart: true, price: 36 },
          { isBeingKept: true, isNewUsedPart: true, price: 72 },
        ],
      }))).toBe(true)
    })

    it('returns true if new and used parts are under budget', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 25,
        parts: [
          { isBeingKept: true, price: 5 },
          { isBeingKept: true, isNewUsedPart: true, price: 36 },
        ],
      }))).toBe(true)

      expect(newPartsUnderBudget(new BuildModel({
        budget: 20,
        parts: [
          { isBeingKept: true, price: 5 },
          { isBeingKept: true, isNewUsedPart: true, price: 36 },
        ],
      }))).toBe(true)
    })

    it('returns false if new parts are over budget', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 20,
        parts: [
          { isBeingKept: true, price: 10 },
          { isBeingKept: true, price: 11 },
        ],
      }))).toBe(true)
    })

    it('returns false if used parts are over budget', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 44,
        parts: [
          { isBeingKept: true, isNewUsedPart: true, price: 72 },
          { isBeingKept: true, isNewUsedPart: true, price: 36 },
        ],
      }))).toBe(true)
    })

    it('returns false if new and used parts are over budget', () => {
      expect(newPartsUnderBudget(new BuildModel({
        budget: 19,
        parts: [
          { isBeingKept: true, price: 5 },
          { isBeingKept: true, isNewUsedPart: true, price: 36 },
        ],
      }))).toBe(true)
    })
  })

  describe('PSU provides enough wattage', () => {
    it('returns true when there is no PSU', () => {
      expect(psuProvidesEnoughWattage(new BuildModel({
        parts: [
          { type: 'GPU', isBeingKept: true, wattage: 10 },
        ],
      }))).toBe(true)
    })

    it('returns true when there are no parts using wattage', () => {
      expect(psuProvidesEnoughWattage(new BuildModel({
        parts: [
          { type: 'Power Supply', isBeingKept: true },
          { type: 'Motherboard', isBeingKept: true },
        ],
      }))).toBe(true)
    })

    it('returns true if the PSU covers the wattage usage of parts', () => {
      expect(psuProvidesEnoughWattage(new BuildModel({
        parts: [
          { type: 'Power Supply', isBeingKept: true, wattage: 100 },
          { type: 'GPU', isBeingKept: true, wattage: 80 },
          { type: 'CPU', isBeingKept: true, wattage: 20 },
        ],
      }))).toBe(true)
    })

    it('returns false if the PSU does not cover the wattage usage', () => {
      expect(psuProvidesEnoughWattage(new BuildModel({
        parts: [
          { type: 'Power Supply', isBeingKept: true, wattage: 100 },
          { type: 'GPU', isBeingKept: true, wattage: 81 },
          { type: 'CPU', isBeingKept: true, wattage: 20 },
        ],
      }))).not.toBe(true)
    })
  })
})
