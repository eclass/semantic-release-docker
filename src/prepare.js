const AggregateError = require('aggregate-error')
const Dockerode = require('dockerode')

const getError = require('./get-error')

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
    const imageName = ctx.env.CI_REGISTRY_IMAGE || pluginConfig.imageName
    const image = docker.getImage(imageName)
    const tags = [ctx.nextRelease.version]
    if (pluginConfig.additionalTags && pluginConfig.additionalTags.length > 0) {
      tags.push(...pluginConfig.additionalTags)
    }
    for (const tag of tags) {
      ctx.logger.log(
        `Tagging docker image ${imageName}:latest to ${imageName}:${tag}`
      )
      await image.tag({ repo: imageName, tag })
    }
    if (
      pluginConfig.additionalRepos &&
      pluginConfig.additionalRepos.length > 0
    ) {
      for (const repo of pluginConfig.additionalRepos) {
        for (const tag of [...tags, 'latest']) {
          ctx.logger.log(
            `Tagging docker image ${imageName}:latest to ${repo}:${tag}`
          )
          await image.tag({ repo, tag })
        }
      }
    }
  } catch (err) {
    throw new AggregateError([getError('EDOCKERIMAGETAG', ctx)])
  }
}
