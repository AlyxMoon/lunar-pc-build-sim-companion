import BaseModel from './_BaseModel'

class ModelProgramRequirements extends BaseModel {
  fieldAliases () {
    return {
      Name: 'name',
      Level: 'level',
      'Is Game': 'isGame',
      Type: 'type',
      'Storage (GB)': 'storage',
      'RAM (GB)': 'memory',
      'CPU score': 'cpuScore',
      'GPU score': 'gpuScore',
      VRAM: 'gpuVram',
      Benchmark: 'benchmark',
    }
  }

  keepAttributes () {
    return [
      'name',
      'level',
      'type',
      'storage',
      'memory',
      'cpuScore',
      'gpuScore',
      'gpuVram',
      'benchmark',
    ]
  }

  mutations () {
    return {
      level: Number,
      storage: Number,
      memory: Number,
      cpuScore: Number,
      gpuScore: Number,
      gpuVram: Number,
      benchmark: Number,
    }
  }
}

export default ModelProgramRequirements
