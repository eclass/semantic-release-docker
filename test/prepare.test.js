/* eslint-disable require-jsdoc */
const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const { Readable } = require('stream')
const mock = require('mock-require')
const { WritableStreamBuffer } = require('stream-buffers')

describe('Prepare', () => {
  const ctx = {
    env: { DOCKER_USER: 'user', DOCKER_PASSWORD: 'password' },
    nextRelease: { version: '1.0.0' },
    logger: { log: () => ({}) },
    cwd: process.cwd(),
    stdout: new WritableStreamBuffer(),
    stderr: new WritableStreamBuffer()
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
        imageName: 'registry.example.com/error'
      }
    ]
  }

  before(() => {
    class DockerImage {
      tag ({ repo, tag }) {
        return new Promise((resolve, reject) => {
          if (/error/.test(repo)) {
            return reject(new Error('invalid image'))
          }
          resolve()
        })
      }
    }
    class DockerMock {
      getImage (imageName) {
        return new DockerImage()
      }
    }
    const execaMock = () => {
      const output =
        'sha256:7ef3cc1955430d87d588ae7fcf84bcb077c8b470d13a183224497db8bf97528d'
      let count = 0
      const stdout = new Readable({
        read (size) {
          if (count === 1) {
            this.push(null)
          } else {
            this.push(output)
          }
          count++
        }
      })
      const stderr = new Readable({
        read (size) {
          this.push(null)
        }
      })
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({ stdout: output })
        }, 100)
      })
      // @ts-ignore
      promise.stdout = stdout
      // @ts-ignore
      promise.stderr = stderr
      return promise
    }
    mock('dockerode', DockerMock)
    mock('execa', execaMock)
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
    ctx.stdout = new WritableStreamBuffer()
    ctx.stderr = new WritableStreamBuffer()
    expect(await prepare(pluginConfig, ctx)).to.be.a('undefined')
  })

  after(() => {
    mock.stopAll()
  })
})
/* eslint-enable require-jsdoc */
