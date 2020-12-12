
import BuildModel from '@/models/Build'

const generateBuildMeetsProgramRequirements = (
  program,
  availablePartsByCategory,
) => {
  const attributes = {
    name: `New Build - run ${program.Name} ${program.Type}`,
    objectives: [
      `Meet requirements to run ${program.Name} ${program.Type}`,
    ],
  }

  // get cpu
  const cpu = availablePartsByCategory.cpus.reduce((best, part) => {
    if (part['Part Ranking Score'] >= program['CPU score']) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get gpu
  const gpu = availablePartsByCategory.gpus.reduce((best, part) => {
    if (
      part['Part Ranking Score'] >= program['GPU score'] &&
      part['VRAM (GB)'] >= program.VRAM
    ) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get memory
  const memory = availablePartsByCategory.memory.reduce((best, part) => {
    if (part['Size (GB)'] >= program['RAM (GB)']) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get storage
  const storage = availablePartsByCategory.storage.reduce((best, part) => {
    if (part['Size (GB)'] >= program['Storage (GB)']) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get motherboard
  const motherboard = availablePartsByCategory.motherboards.reduce((best, part) => {
    if (part['CPU Socket'] === cpu.Socket) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get cpu cooler
  const cpuCooler = availablePartsByCategory.cpucoolers.reduce((best, part) => {
    if (part[cpu.Socket]) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get power supply
  const powerSupply = availablePartsByCategory.powersupplies.reduce((best, part) => {
    if (part.Wattage >= cpu.Wattage + gpu.Wattage) {
      if (best.Price > part.Price) return part
    }

    return best
  }, { Price: Infinity })

  // get case
  const computerCase = availablePartsByCategory.cases.reduce((best, part) => {
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

  const caseFans = [1, 2, 3].reduce((fans, i) => {
    const model = computerCase[`Case Fan Type ${i} Model`]
    const count = computerCase[`Case Fan Type ${i} Count`]

    if (!count || !model) return fans

    const fan = availablePartsByCategory.casefans.find(part => {
      return part['Full Part Name'] === model
    })

    for (let i = 0; i < count; i++) fans.push(fan)

    return fans
  }, [])

  attributes.newParts = [
    cpu,
    gpu,
    memory,
    storage,
    motherboard,
    cpuCooler,
    powerSupply,
    computerCase,
    ...caseFans,
  ]

  return new BuildModel(attributes)
}

export default generateBuildMeetsProgramRequirements
