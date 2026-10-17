import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mts'

export default mergeConfig(
  viteConfig({ command: 'serve', mode: 'test' }),
  defineConfig({
    test: {
      environment: 'node',
      include: ['tests/unit/**/*.spec.ts'],
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['text', 'lcov'],
        reportsDirectory: 'tests/coverage',
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/main.ts', 'src/**/*.d.ts'],
      },
    },
  }),
)
