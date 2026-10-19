import { Parts, ProgramRequirementsModelInterface } from '@/typings'
import BuildModel from '@/models/Build.model'
import { socketsAreCompatible } from '@/lib/buildValidationRules/motherboardFitsCpu'

const generateBuildMeetsProgramRequirements = (
  program: ProgramRequirementsModelInterface,
  availablePartsByCategory: Parts.ByAllCategoriesInterface,
  { playerLevel }: { playerLevel: number },
): BuildModel | { error: string } => {
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

  const cpu = availablePartsByCategory.cpus.reduce((
    best: Parts.CpuInterface | undefined,
    part: Parts.CpuInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.score >= program.cpuScore &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!cpu) return { error: 'No matching part for category: CPU.' }

  const gpu = availablePartsByCategory.gpus.reduce((
    best: Parts.GpuInterface | undefined,
    part: Parts.GpuInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.scoreSingle >= program.gpuScore &&
      part.vramGb >= program.gpuVram &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!gpu) return { error: 'No matching part for category: GPU.' }

  const memory = availablePartsByCategory.memory.reduce((
    best: Parts.MemoryInterface | undefined,
    part: Parts.MemoryInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.sizeGb >= program.memory &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!memory) return { error: 'No matching part for category: Memory.' }

  const storage = availablePartsByCategory.storage.reduce((
    best: Parts.StorageInterface | undefined,
    part: Parts.StorageInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.sizeGb >= program.storage &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!storage) return { error: 'No matching part for category: Storage.' }

  const motherboard = availablePartsByCategory.motherboards.reduce((
    best: Parts.MotherboardInterface | undefined,
    part: Parts.MotherboardInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      socketsAreCompatible(cpu.socket, part.socket) &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!motherboard) return { error: 'No matching part for category: Motherboard.' }

  const cpuCooler = availablePartsByCategory.cpucoolers.reduce((
    best: Parts.CpuCoolerInterface | undefined,
    part: Parts.CpuCoolerInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.supportedCpus.includes(cpu.socket) &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!cpuCooler) return { error: 'No matching part for category: CPU Cooler.' }

  const powerSupply = availablePartsByCategory.powersupplies.reduce((
    best: Parts.PowerSupplyInterface | undefined,
    part: Parts.PowerSupplyInterface,
  ) => {
    return (
      part.level <= playerLevel &&
      part.wattage >= (cpu.wattage + gpu.wattage) &&
      (best?.price ?? Infinity) >= part.price
    ) ? part : best
  }, undefined)

  if (!powerSupply) return { error: 'No matching part for category: Power Supply.' }

  const computerCase = availablePartsByCategory.cases.reduce((
    best: Parts.CaseInterface | undefined,
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
  }, undefined)

  if (!computerCase) return { error: 'No matching part for category: Case.' }

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
