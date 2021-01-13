import { PlainObject, ProgramRequirementsModelInterface } from '@/typings/interface'
import BuildModel from '@/models/Build.model'

const generateBuildMeetsProgramRequirements = (
  program: ProgramRequirementsModelInterface,
  availablePartsByCategory: Record<string, PlainObject>,
  { playerLevel }: { playerLevel: number },
): { [key: string]: any } => {
  const attributes: {
    name: string,
    objectives: string[],
    parts: PlainObject[],
  } = {
    name: `New Build - run ${program.get('name', true)} | ${program.get('type', true)}`,
    objectives: [
      `Meet requirements to run ${program.get('name', true)} | ${program.get('type', true)}`,
    ],
    parts: [],
  }

  // get cpu
  const cpu = availablePartsByCategory.cpus.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (part['Basic CPU Score'] >= (program.cpuScore || 0)) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get gpu
  const gpu = availablePartsByCategory.gpus.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (
      part['Single GPU Graphics Score'] >= (program.gpuScore || 0) &&
      part['VRAM (GB)'] >= (program.gpuVram || 0)
    ) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get memory
  const memory = availablePartsByCategory.memory.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (part['Size (GB)'] >= (program.memory || 0)) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get storage
  const storage = availablePartsByCategory.storage.reduce((best: PlainObject, part: PlainObject) => {
    if (part.level > playerLevel) return best

    if (part.sizeGb >= (program.storage || 0)) {
      if (best.price > part.price) return part
    }

    return best
  }, { price: Infinity })

  // get motherboard
  const motherboard = availablePartsByCategory.motherboards.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (part['CPU Socket'] === cpu.Socket) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get cpu cooler
  const cpuCooler = availablePartsByCategory.cpucoolers.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (part[cpu.Socket]) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get power supply
  const powerSupply = availablePartsByCategory.powersupplies.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (part.Wattage >= +cpu.Wattage + +gpu.Wattage) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get case
  const computerCase = availablePartsByCategory.cases.reduce((best: PlainObject, part: PlainObject) => {
    if (part.Level > playerLevel) return best

    if (
      part[`PSU ${powerSupply.Size}`] &&
      part['Max PSU length'] >= powerSupply.Length &&
      part[motherboard.Size] &&
      part['Max GPU length'] >= gpu.Length &&
      part['Max CPU Fan Height'] >= cpuCooler.Height
    ) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  const caseFans = [1, 2, 3].reduce((fans: PlainObject[], i) => {
    const model = computerCase[`Case Fan Type ${i} Model`]
    const count = computerCase[`Case Fan Type ${i} Count`]

    if (!count || !model) return fans

    const fan = availablePartsByCategory.casefans.find((part: PlainObject) => {
      return part.nameFull === model
    })

    if (fan) {
      for (let i = 0; i < count; i++) fans.push(fan)
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
  ].map((part: PlainObject) => ({
    ...part,
    isNewPart: true,
    isBeingKept: true,
    isPartOfCase: part.type === 'Case Fan',
  }))

  return new BuildModel(attributes)
}

export default generateBuildMeetsProgramRequirements
