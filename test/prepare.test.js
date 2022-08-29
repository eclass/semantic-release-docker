/* eslint-disable require-jsdoc */
const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')

describe('Prepare', () => {
  const ctx = {
    env: { DOCKER_USER: 'user', DOCKER_PASSWORD: 'password' },
    nextRelease: { version: '1.0.0' },
    logger: { log: () => ({}), error: () => ({}) },
  }
  let prepare
  /** @type {import('../src/types').Config} */
  const pluginConfig = {
    baseImageName: 'ci.example.com/myapp',
    registries: [
      {
        user: 'DOCKER_USER',
        password: 'DOCKER_PASSWORD',
        url: 'registry.example.com',
        imageName: 'registry.example.com/error',
      },
    ],
  }

  before(() => {
    class DockerImage {
      tag({ repo, tag }) {
        return new Promise((resolve, reject) => {
          if (/error/.test(repo)) {
            return reject(new Error('invalid image'))
          }
          resolve()
        })
      }
    }
    class DockerMock {
      getImage(imageName) {
        return new DockerImage()
      }
    }
    mock('dockerode', DockerMock)
    prepare = require('../src/prepare')
  })

  it('expect a EDOCKERIMAGETAG error', async () => {
    try {
      await prepare(pluginConfig, ctx)
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('EDOCKERIMAGETAG')
    }
  })

  it('expect success prepare', async () => {
    pluginConfig.registries[0].imageName = 'registry.example.com/myapp'
    pluginConfig.additionalTags = ['beta']
    expect(await prepare(pluginConfig, ctx)).to.be.a('undefined')
  })

  after(() => {
    mock.stopAll()
  })
})
/* eslint-enable require-jsdoc */
