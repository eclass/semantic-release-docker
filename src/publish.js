const AggregateError = require('aggregate-error')
const Dockerode = require('dockerode')

const getError = require('./get-error')
const getAuth = require('./getAuth')

/** @typedef {import('stream').Readable} ReadableStream */
/**
 * @param {ReadableStream} response -
 * @returns {Promise<void>} -
 * @example
 * pushImage(response)
 */
const pushImage = response => {
  return new Promise((resolve, reject) => {
    let error
    response.on('data', chunk => {
      const data = JSON.parse(chunk.toString())
      if (data.error) {
        error = new Error(data.error)
      }
    })
    response.on('end', () => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
    response.on('error', error => {
      reject(error)
    })
  })
}

/**
 * @typedef {import('./types').Context} Context
 * @typedef {import('./types').Config} Config
 */
/**
 * @param {Config} pluginConfig -
 * @param {Context} ctx -
 * @returns {Promise<*>} -
 * @example
 * verifyConditions(pluginConfig, ctx)
 */
module.exports = async (pluginConfig, ctx) => {
  try {
    const docker = new Dockerode()
    const baseImageTag = pluginConfig.baseImageTag || 'latest'
    const tags = [baseImageTag, ctx.nextRelease.version]
    if (pluginConfig.additionalTags && pluginConfig.additionalTags.length > 0) {
      tags.push(...pluginConfig.additionalTags)
    }
    for (const registry of pluginConfig.registries) {
      const { user, password, url, imageName } = getAuth(
        registry.user,
        registry.password,
        registry.url,
        registry.imageName,
        ctx
      )
      const image = docker.getImage(imageName)
      const options = {
        password: password,
        serveraddress: url,
        username: user
      }
      for (const tag of tags) {
        ctx.logger.log(`Pushing docker image ${imageName}:${tag}`)
        const response = await image.push({ tag, ...options })
        // @ts-ignore
        await pushImage(response)
      }
    }
  } catch (err) {
    throw new AggregateError([getError('EDOCKERIMAGEPUSH', ctx)])
  }
}
