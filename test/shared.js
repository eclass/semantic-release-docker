/* eslint-disable require-jsdoc, sonarjs/no-duplicate-string */
const EventEmitter = require('events')

/** @type {string[]} */
const tags = []

// @ts-ignore
class MyEmitter extends EventEmitter {}

/**
 * @typedef {import('../src/types').Context} Context
 * @typedef {import('../src/types').Config} Config
 */

/**
 * @returns {Context} -.
 * @example const ctx = createContext()
 */
const createContext = () => ({
  env: { DOCKER_USER: 'user', DOCKER_PASSWORD: 'password' },
  nextRelease: {
    version: '1.0.0',
    type: 'major',
    gitHead: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    gitTag: 'v1.0.0',
    notes: 'Release notes for version 1.1.0...',
  },
  logger: { log: () => ({}), error: () => ({}) },
})

/**
 * @param {boolean} [valid=true] -.
 * @returns {Config} -.
 * @example const pluginConfig = createConfig()
 */
const createConfig = (valid = true) => {
  if (!valid) return {}
  return {
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
}

class DockerImage {
  tag({ repo, tag }) {
    tags.push(tag)
    return new Promise((resolve, reject) => {
      if (/error/.test(repo)) {
        return reject(new Error('invalid image'))
      }
      resolve()
    })
  }

  push({ tag, password, serveraddress, username }) {
    tags.push(tag)

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
  checkAuth({ password, serveraddress, username }) {
    return new Promise((resolve, reject) => {
      if (username === 'error') {
        return reject(new Error('invalid login'))
      }
      resolve()
    })
  }

  getImage(imageName) {
    return new DockerImage()
  }
}

/**
 * @param {string} tag -.
 * @returns {boolean} -.
 * @example existImageTag('latest')
 */
const existImageTag = (tag) => tags.some((_tag) => _tag === tag)

module.exports = {
  createContext,
  createConfig,
  DockerMock,
  tags,
  existImageTag,
}
/* eslint-enable require-jsdoc, sonarjs/no-duplicate-string */
