import { Context as SemanticReleaseContext } from 'semantic-release'
import { Config as SemanticReleaseConfig } from 'semantic-release'

export interface Context extends SemanticReleaseContext {
  commits?: SemanticRelease.Commit[]
  message?: string
}

export interface Registry {
  url?: string
  imageName?: string
  user?: string
  password?: string
  skipTags?: string[];
}

export interface Config extends SemanticReleaseConfig {
  additionalTags?: string[]
  registries?: Registry[]
  baseImageName?: string
  baseImageTag?: string
}

export interface ExecOptions {
  host: string
  user: string
  port?: number
  key?: string | Buffer
  fingerprint?: string
  password?: string
}
