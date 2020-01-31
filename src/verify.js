const AggregateError = require('aggregate-error')

const getError = require('./get-error')
const dockerLogin = require('./dockerLogin')
const getAuth = require('./getAuth')

/**
 * @typedef {import('semantic-release').Context} Context
 * @typedef {import('semantic-release').Config} Config
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
    const { user, pass, registryUrl } = await getAuth(pluginConfig, ctx)
    return dockerLogin(user, pass, registryUrl)
  } catch (err) {
    if (err instanceof AggregateError) {
      throw err
    } else {
      throw new AggregateError([getError('EDOCKERLOGIN', ctx)])
    }
  }
}
