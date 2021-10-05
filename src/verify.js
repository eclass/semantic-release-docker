/* eslint-disable sonarjs/cognitive-complexity */
const AggregateError = require('aggregate-error')

const getError = require('./get-error')
const dockerLogin = require('./dockerLogin')
const getAuth = require('./getAuth')

/**
 * @typedef {import('./types').Context} Context
 * @typedef {import('./types').Config} Config
 */
/**
 * @param {Config} pluginConfig -
 * @param {Context} ctx -
 * @returns {Promise<void>} -
 * @example
 * verifyConditions(pluginConfig, ctx)
 */
module.exports = async (pluginConfig, ctx) => {
  const errors = []
  if (!pluginConfig.baseImageName) {
    errors.push(getError('ENOBASEIMAGENAME', ctx))
  }
  if (!pluginConfig.registries || pluginConfig.registries.length === 0) {
    errors.push(getError('ENOREGISTRY', ctx))
  } else {
    for (const { user, password, url, imageName, skipTags } of pluginConfig.registries) {
      if (skipTags && !Array.isArray(skipTags)) {
        errors.push(getError('ESKIPTAGSNOTANARRAY', ctx))
      }

      try {
        getAuth(user, password, url, imageName, ctx)
        // eslint-disable-next-line security/detect-object-injection
        await dockerLogin(ctx.env[user], ctx.env[password], url)
      } catch (err) {
        if (err instanceof AggregateError) {
          for (const individualError of err) {
            errors.push(individualError)
          }
        } else {
          errors.push(getError('EDOCKERLOGIN', ctx))
        }
      }
    }
  }
  if (errors.length > 0) {
    throw new AggregateError(errors)
  }
}
/* eslint-enable sonarjs/cognitive-complexity */
