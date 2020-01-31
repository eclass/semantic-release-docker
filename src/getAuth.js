/* eslint-disable sonarjs/cognitive-complexity */
const { promisify } = require('util')
const AggregateError = require('aggregate-error')
const awscred = require('awscred')

const getError = require('./get-error')
const ecrLogin = require('./ecrLogin')

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
const getAuth = async (pluginConfig, ctx) => {
  const errors = []
  const user = ctx.env.CI_REGISTRY_USER || ctx.env.DOCKER_REGISTRY_USER
  if (!user) {
    errors.push(getError('ENODOCKERUSER', ctx))
  }
  const pass = ctx.env.CI_REGISTRY_PASSWORD || ctx.env.DOCKER_REGISTRY_PASSWORD
  if (!pass) {
    errors.push(getError('ENODOCKERPASSWORD', ctx))
  }
  const registryUrl =
    ctx.env.CI_REGISTRY || ctx.env.DOCKER_REGISTRY || pluginConfig.registryUrl
  if (!registryUrl) {
    errors.push(getError('ENODOCKERREGISTRY', ctx))
  }
  const imageName = ctx.env.CI_REGISTRY_IMAGE || pluginConfig.imageName
  if (!imageName) {
    errors.push(getError('ENOIMAGENAME', ctx))
  }
  if (errors.length > 0) {
    throw new AggregateError(errors)
  } else if (!pluginConfig.ecr) {
    return Promise.resolve({ user, pass, registryUrl })
  }
  try {
    const { credentials, region } = await promisify(awscred.load)()
    if (!credentials) {
      errors.push(getError('ENOAWSACCESSKEYID', ctx))
      errors.push(getError('ENOAWSSECRETACCESSKEY', ctx))
    } else {
      if (!credentials.accessKeyId) {
        errors.push(getError('ENOAWSACCESSKEYID', ctx))
      }
      if (!credentials.secretAccessKey) {
        errors.push(getError('ENOAWSSECRETACCESSKEY', ctx))
      }
    }
    if (!region) {
      errors.push(getError('ENOAWSREGION', ctx))
    }
    if (errors.length > 0) {
      throw new AggregateError(errors)
    } else {
      return ecrLogin(
        credentials.accessKeyId,
        credentials.secretAccessKey,
        region
      )
    }
  } catch (err) {
    errors.push(getError('EECRLOGIN', ctx))
    throw new AggregateError(errors)
  }
}

module.exports = getAuth
/* eslint-enable sonarjs/cognitive-complexity */
