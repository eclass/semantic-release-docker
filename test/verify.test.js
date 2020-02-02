/* eslint-disable require-jsdoc */
const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')

describe('Verify', () => {
  const env = {}
  let verify
  /** @type {import('../src/types').Config} */
  const pluginConfig = {}

  before(() => {
    class DockerMock {
      checkAuth ({ password, serveraddress, username }) {
        return new Promise((resolve, reject) => {
          if (username === 'error') {
            return reject(new Error('invalid login'))
          }
          resolve()
        })
      }
    }
    mock('dockerode', DockerMock)
    verify = require('../src/verify')
  })

  it('expect a ENOBASEIMAGENAME error', async () => {
    try {
      await verify(pluginConfig, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENOBASEIMAGENAME')
    }
  })

  it('expect a ENOREGISTRY error', async () => {
    try {
      pluginConfig.baseImageName = 'ci.example.com/myapp'
      await verify(pluginConfig, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENOREGISTRY')
    }
  })

  it('expect a ENODOCKERUSER error', async () => {
    try {
      pluginConfig.registries = [
        {
          user: 'DOCKER_USER',
          password: 'DOCKER_PASSWORD',
          url: 'registry.example.com',
          imageName: 'registry.example.com/myapp'
        }
      ]
      await verify(pluginConfig, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENODOCKERUSER')
    }
  })

  it('expect a ENODOCKERREGISTRY error', async () => {
    try {
      env.DOCKER_USER = 'error'
      env.DOCKER_PASSWORD = 'password'
      delete pluginConfig.registries[0].url
      await verify(pluginConfig, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENODOCKERREGISTRY')
    }
  })

  it('expect a ENOIMAGENAME error', async () => {
    try {
      pluginConfig.registries[0].url = 'registry.example.com'
      delete pluginConfig.registries[0].imageName
      await verify(pluginConfig, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENOIMAGENAME')
    }
  })

  it('expect a EDOCKERLOGIN error', async () => {
    try {
      pluginConfig.registries[0].imageName = 'registry.example.com/myapp'
      await verify(pluginConfig, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('EDOCKERLOGIN')
    }
  })

  it('expect success verify', async () => {
    env.DOCKER_USER = 'user'
    expect(await verify(pluginConfig, { env })).to.be.a('undefined')
  })

  after(() => {
    mock.stopAll()
  })
})
/* eslint-enable require-jsdoc */
