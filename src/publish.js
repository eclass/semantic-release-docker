const AggregateError = require('aggregate-error')
const Dockerode = require('dockerode')

const getAuth = require('./getAuth')
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
    // @ts-ignore
    const imageName = ctx.env.CI_REGISTRY_IMAGE || pluginConfig.imageName
    const { user, pass, registryUrl } = await getAuth(pluginConfig, ctx)
    const options = {
      password: pass,
      serveraddress: registryUrl,
      username: user
    }
    const tags = ['latest', ctx.nextRelease.version]
    if (pluginConfig.additionalTags && pluginConfig.additionalTags.length > 0) {
      tags.push(...pluginConfig.additionalTags)
    }
    const images = [imageName]
    if (
      pluginConfig.additionalRepos &&
      pluginConfig.additionalRepos.length > 0
    ) {
      images.push(...pluginConfig.additionalRepos)
    }
    for (const imageName of images) {
      const image = docker.getImage(imageName)
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
