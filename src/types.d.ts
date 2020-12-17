import {
  Config as SemanticReleaseConfig,
  Context as SemanticReleaseContext,
  Result as SemanticReleaseResult
} from 'semantic-release'

export interface Context
  extends SemanticReleaseContext,
    SemanticReleaseConfig,
    SemanticReleaseResult {
  message?: string
}

export interface Registry {
  url?: string
  imageName?: string
  user?: string
  password?: string
}

export interface Config {
  additionalTags?: string[]
  registries?: Registry[]
  baseImageName?: string
  baseImageTag?: string
  dockerfile?: string
  context?: string
  buildArgs?: string[]
  cacheFrom?: string
}

export interface ExecOptions {
  host: string
  user: string
  port?: number
  key?: string | Buffer
  fingerprint?: string
  password?: string
}
