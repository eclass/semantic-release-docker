const AggregateError = require('aggregate-error')
const Dockerode = require('dockerode')
const { template } = require('lodash')

const getError = require('./get-error')

/**
 * @typedef {import('./types').Context} Context
 * @typedef {import('./types').Config} Config
 */
/**
 * @param {Config} pluginConfig -.
 * @param {Context} ctx -.
 * @returns {Promise<*>} -.
 * @example
 * verifyConditions(pluginConfig, ctx)
 */
module.exports = async (pluginConfig, ctx) => {
  try {
    const docker = new Dockerode()
    const image = docker.getImage(pluginConfig.baseImageName)
    const tags = [ctx.nextRelease.version]
    if (pluginConfig.additionalTags && pluginConfig.additionalTags.length > 0) {
      tags.push(...pluginConfig.additionalTags)
    }
    const baseImageTag =
      ctx.env.DOCKER_BASE_IMAGE_TAG || pluginConfig.baseImageTag || 'latest'
    if (!ctx.nextRelease.channel) {
      tags.push(baseImageTag)
    }
    for (let tag of tags) {
      tag = template(tag)(ctx)
      ctx.logger.log(
        `Tagging docker image ${pluginConfig.baseImageName} to ${pluginConfig.baseImageName}:${tag}`,
      )
      await image.tag({ repo: pluginConfig.baseImageName, tag })
    }
    for (const { imageName } of pluginConfig.registries) {
      for (let tag of tags) {
        tag = template(tag)(ctx)
        ctx.logger.log(
          `Tagging docker image ${pluginConfig.baseImageName} to ${imageName}:${tag}`,
        )
        await image.tag({ repo: imageName, tag })
      }
    }
  } catch (err) {
    throw new AggregateError([getError('EDOCKERIMAGETAG', ctx)])
  }
}
