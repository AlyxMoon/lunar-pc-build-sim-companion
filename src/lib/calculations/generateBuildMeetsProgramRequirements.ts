import { Parts, ProgramRequirementsModelInterface } from '@/typings'
import BuildModel from '@/models/Build.model'

const generateBuildMeetsProgramRequirements = (
  program: ProgramRequirementsModelInterface,
  availablePartsByCategory: Parts.ByAllCategoriesInterface,
  { playerLevel }: { playerLevel: number },
): BuildModel => {
  const attributes: {
    name: string,
    objectives: string[],
    parts: Parts.BaseInterface[],
  } = {
    name: `New Build - run ${program.get('name', true)} | ${program.get('type', true)}`,
    objectives: [
      `Meet requirements to run ${program.get('name', true)} | ${program.get('type', true)}`,
    ],
    parts: [],
  }

  const cpu: Parts.CpuInterface = availablePartsByCategory.cpus.reduce((
    best: Parts.CpuInterface,
    part: Parts.CpuInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.score >= program.cpuScore &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const gpu: Parts.GpuInterface = availablePartsByCategory.gpus.reduce((
    best: Parts.GpuInterface,
    part: Parts.GpuInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.scoreSingle >= program.gpuScore &&
      part.vramGb >= program.gpuVram &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const memory: Parts.MemoryInterface = availablePartsByCategory.memory.reduce((
    best: Parts.MemoryInterface,
    part: Parts.MemoryInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.sizeGb >= program.memory &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const storage: Parts.StorageInterface = availablePartsByCategory.storage.reduce((
    best: Parts.StorageInterface,
    part: Parts.StorageInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.sizeGb >= program.storage &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const motherboard: Parts.MotherboardInterface = availablePartsByCategory.motherboards.reduce((
    best: Parts.MotherboardInterface,
    part: Parts.MotherboardInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.socket >= cpu.socket &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const cpuCooler = availablePartsByCategory.cpucoolers.reduce((
    best: Parts.CpuCoolerInterface,
    part: Parts.CpuCoolerInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.supportedCpus.includes(cpu.socket) &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const powerSupply: Parts.PowerSupplyInterface = availablePartsByCategory.powersupplies.reduce((
    best: Parts.PowerSupplyInterface,
    part: Parts.PowerSupplyInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.wattage >= (cpu.wattage + gpu.wattage) &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const computerCase: Parts.CaseInterface = availablePartsByCategory.cases.reduce((
    best: Parts.CaseInterface,
    part: Parts.CaseInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.supportedMotherboards.includes(motherboard.sizeType) &&
      part.supportedPowersupplies.includes(powerSupply.sizeType) &&
      part.maxLengthPsu >= powerSupply.length &&
      part.maxLengthGpu >= gpu.length &&
      part.maxLengthCpuFan >= cpuCooler.length &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  })

  const caseFans: Parts.CaseFanInterface[] = [1, 2, 3].reduce((
    fans: Parts.CaseFanInterface[],
    i: number,
  ) => {
    const model = computerCase[`case${i}Model`] as string
    const count = computerCase[`case${i}Count`] as number

    if (!count || !model) return fans

    const fan = availablePartsByCategory.casefans.find(part => {
      return part.nameFull === model
    })

    if (fan) {
      for (let i = 0; i < count; i++) {
        fans.push({ ...fan, isPartOfCase: true })
      }
    }

    return fans
  }, [])

  attributes.parts = [
    cpu,
    gpu,
    memory,
    storage,
    motherboard,
    cpuCooler,
    powerSupply,
    computerCase,
    ...caseFans,
  ].map(part => ({
    ...part,
    isNewPart: true,
    isBeingKept: true,
    isPartOfCase: part.type === 'Case Fan',
  }))

  return new BuildModel(attributes)
}

export default generateBuildMeetsProgramRequirements
