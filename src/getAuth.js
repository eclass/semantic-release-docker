/* eslint-disable security/detect-object-injection */
const AggregateError = require('aggregate-error')

const getError = require('./get-error')

/**
 * @typedef {import('./types').Context} Context
 * @typedef {import('./types').Config} Config
 * @typedef {import('./types').Registry} Registry
 */
/**
 * @param {string} user -
 * @param {string} password -
 * @param {string} registry -
 * @param {string} imageName -
 * @param {Context} ctx -
 * @returns {void} -
 * @example
 * verifyConditions(pluginConfig, ctx)
 */
const getAuth = (user, password, registry, imageName, ctx) => {
  const errors = []
  if (!user || !ctx.env[user]) {
    errors.push(getError('ENODOCKERUSER', ctx))
  }
  if (!password || !ctx.env[password]) {
    errors.push(getError('ENODOCKERPASSWORD', ctx))
  }
  if (!registry) {
    errors.push(getError('ENODOCKERREGISTRY', ctx))
  }
  if (!imageName) {
    errors.push(getError('ENOIMAGENAME', ctx))
  }
  if (errors.length > 0) {
    throw new AggregateError(errors)
  }
}

module.exports = getAuth
/* eslint-enable security/detect-object-injection */
