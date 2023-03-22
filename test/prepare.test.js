const { describe, it, before, beforeEach, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')
const { createContext, createConfig, DockerMock, tags } = require('./shared')

describe('Prepare', () => {
  let prepare

  before(() => {
    tags.splice(0, tags.length)
    mock('dockerode', DockerMock)
    prepare = require('../src/prepare')
  })

  beforeEach(() => {
    tags.splice(0, tags.length)
  })

  it('expect a EDOCKERIMAGETAG error', async () => {
    try {
      const pluginConfig = createConfig()
      const ctx = createContext()
      await prepare(pluginConfig, ctx)
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('EDOCKERIMAGETAG')
    }
  })

  it('expect success prepare', async () => {
    const pluginConfig = createConfig()
    const ctx = createContext()
    pluginConfig.registries[0].imageName = 'registry.example.com/myapp'
    pluginConfig.additionalTags = ['beta']
    expect(await prepare(pluginConfig, ctx)).to.be.a('undefined')
    expect(tags).include('beta')
    expect(tags).include('latest')
  })

  it('prepare with custom branch', async () => {
    const pluginConfig = createConfig()
    const ctx = createContext()
    pluginConfig.registries[0].imageName = 'registry.example.com/myapp'
    ctx.nextRelease.channel = 'staging'
    expect(await prepare(pluginConfig, ctx)).to.be.a('undefined')
    expect(tags).include('staging')
  })

  after(() => {
    mock.stopAll()
  })
})
