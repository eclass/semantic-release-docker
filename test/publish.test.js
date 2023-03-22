/* eslint-disable sonarjs/no-duplicate-string */
const { describe, it, before, beforeEach, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')
const { createContext, createConfig, DockerMock, tags } = require('./shared')

describe('Publish', () => {
  let publish
  before(() => {
    tags.splice(0, tags.length)
    mock('dockerode', DockerMock)
    publish = require('../src/publish')
  })

  beforeEach(() => {
    tags.splice(0, tags.length)
  })

  it('expect a EDOCKERIMAGEPUSH error', async () => {
    try {
      const pluginConfig = createConfig()
      const ctx = createContext()
      await publish(pluginConfig, ctx)
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('EDOCKERIMAGEPUSH')
    }
  })

  it('expect success publish', async () => {
    const pluginConfig = createConfig()
    const ctx = createContext()
    pluginConfig.registries[0].url = 'registry.example.com'
    pluginConfig.additionalTags = ['beta']
    expect(await publish(pluginConfig, ctx)).to.be.a('undefined')
    expect(tags).include('latest')
    expect(tags).include('beta')
  })

  it('expect skip "latest" publish', async () => {
    const pluginConfig = createConfig()
    const ctx = createContext()
    pluginConfig.registries[0].url = 'registry.example.com'
    pluginConfig.registries[0].skipTags = ['latest']
    expect(await publish(pluginConfig, ctx)).to.be.a('undefined')
    expect(tags).not.include('latest')
  })

  it('expect publish branch channel as image tag', async () => {
    const pluginConfig = createConfig()
    const ctx = createContext()
    pluginConfig.registries[0].url = 'registry.example.com'
    ctx.nextRelease.channel = 'staging'
    expect(await publish(pluginConfig, ctx)).to.be.a('undefined')
    expect(tags).include('staging')
  })

  after(() => {
    mock.stopAll()
  })
})
/* eslint-enable sonarjs/no-duplicate-string */
