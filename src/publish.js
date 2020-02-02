const AggregateError = require('aggregate-error')
const Dockerode = require('dockerode')

const getError = require('./get-error')

/** @typedef {import('stream').Readable} ReadableStream */
/**
 * @param {ReadableStream} response -
 * @returns {Promise<void>} -
 * @example
 * pushImage(response)
 */
const pushImage = response => {
  return new Promise((resolve, reject) => {
    response.on('end', () => resolve())
    response.on('error', error => reject(error))
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
    const tags = ['latest', ctx.nextRelease.version]
    if (pluginConfig.additionalTags && pluginConfig.additionalTags.length > 0) {
      tags.push(...pluginConfig.additionalTags)
    }
    for (const { user, password, url, imageName } of pluginConfig.registries) {
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
