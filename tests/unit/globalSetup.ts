import { execFileSync } from 'node:child_process'

export default function setup() {
  execFileSync(process.execPath, ['scripts/convertRawData/convertRawData.ts'], {
    timeout: 30000,
  })
}
