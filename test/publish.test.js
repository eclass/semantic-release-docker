/* eslint-disable require-jsdoc */
const EventEmitter = require('events')
const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')

describe('Publish', () => {
  // @ts-ignore
  class MyEmitter extends EventEmitter {}
  const ctx = {
    env: { DOCKER_USER: 'user', DOCKER_PASSWORD: 'password' },
    nextRelease: { version: '1.0.0' },
    logger: { log: () => ({}), error: () => ({}) },
  }
  let publish
  /** @type {import('../src/types').Config} */
  const pluginConfig = {
    baseImageName: 'ci.example.com/myapp',
    registries: [
      {
        user: 'DOCKER_USER',
        password: 'DOCKER_PASSWORD',
        url: 'registry.error.com',
        imageName: 'registry.example.com/myapp',
      },
    ],
  }
  let dockerPushArgs

  before(() => {
    class DockerImage {
      push({ tag, password, serveraddress, username }) {
        dockerPushArgs.push({ tag, password, serveraddress, username })

        return new Promise((resolve, reject) => {
          const response = new MyEmitter()
          setTimeout(() => {
            if (/error/.test(serveraddress)) {
              // @ts-ignore
              response.emit('error', new Error('remote error'))
            } else {
              // @ts-ignore
              response.emit('end')
            }
          }, 500)
          resolve(response)
        })
      }
    }
    class DockerMock {
      getImage(imageName) {
        return new DockerImage()
      }
    }
    mock('dockerode', DockerMock)
    publish = require('../src/publish')
  })

  // eslint-disable-next-line no-undef
  beforeEach(() => {
    dockerPushArgs = []
  })

  it('expect a EDOCKERIMAGEPUSH error', async () => {
    try {
      await publish(pluginConfig, ctx)
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('EDOCKERIMAGEPUSH')
    }
  })

  it('expect success publish', async () => {
    pluginConfig.registries[0].url = 'registry.example.com'
    pluginConfig.additionalTags = ['beta']
    expect(await publish(pluginConfig, ctx)).to.be.a('undefined')
    // eslint-disable-next-line no-unused-expressions
    expect(isTagPublished('latest')).to.be.true
    // eslint-disable-next-line no-unused-expressions
    expect(isTagPublished('beta')).to.be.true
  })

  it('expect skip "latest" publish', async () => {
    pluginConfig.registries[0].url = 'registry.example.com'
    pluginConfig.registries[0].skipTags = ['latest']
    expect(await publish(pluginConfig, ctx)).to.be.a('undefined')
    // eslint-disable-next-line no-unused-expressions
    expect(isTagPublished('latest')).to.be.false
  })

  after(() => {
    mock.stopAll()
  })

  const isTagPublished = (tag) => {
    return dockerPushArgs.some((arg) => arg.tag === tag)
  }
})
/* eslint-enable require-jsdoc */
