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
 * @returns {Registry} -
 * @example
 * verifyConditions(pluginConfig, ctx)
 */
const getAuth = (user, password, registry, imageName, ctx) => {
  const errors = []
  /** @type {import('./types').Registry} */
  const auth = {}
  if (!user || !ctx.env[user]) {
    errors.push(getError('ENODOCKERUSER', ctx))
  } else {
    auth.user = ctx.env[user]
  }
  if (!password || !ctx.env[password]) {
    errors.push(getError('ENODOCKERPASSWORD', ctx))
  } else {
    auth.password = ctx.env[password]
  }
  if (!registry) {
    errors.push(getError('ENODOCKERREGISTRY', ctx))
  } else {
    auth.url = registry
  }
  if (!imageName) {
    errors.push(getError('ENOIMAGENAME', ctx))
  } else {
    auth.imageName = imageName
  }
  if (errors.length > 0) {
    throw new AggregateError(errors)
  }
  return auth
}

module.exports = getAuth
/* eslint-enable security/detect-object-injection */
