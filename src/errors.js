/* eslint-disable sonarjs/no-duplicate-string */
// @ts-ignore
const pkg = require('../package.json')

const [homepage] = pkg.homepage.split('#')
/**
 * @param {string} file -
 * @returns {string} -
 * @example
 * const link = linkify(href)
 */
const linkify = file => `${homepage}/blob/master/${file}`

/**
 * @typedef {import('./types').Context} Context
 */
/**
 * @typedef {Object} SemanticReleaseError
 * @property {string} message -
 * @property {string} details -
 */

module.exports = new Map([
  [
    'ENOREGISTRY',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No registry specified.',
      details: `An [registry](${linkify(
        'README.md#options'
      )}) must be set in the \`registries\` key in plugin config.`
    })
  ],
  [
    'ENODOCKERUSER',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No docker username specified.',
      details: `An [docker username](${linkify(
        'README.md#environment-variables'
      )}) must be created and set the environment variable on your CI environment defined in \`registries\`.`
    })
  ],
  [
    'ENODOCKERPASSWORD',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No docker password specified.',
      details: `An [docker password](${linkify(
        'README.md#environment-variables'
      )}) must be created and set the environment variable on your CI environment defined in \`registries\`.`
    })
  ],
  [
    'ENODOCKERREGISTRY',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No docker registry specified.',
      details: `An [docker registry](${linkify(
        'README.md#options'
      )}) must be set \`url\` in \`registries\`.`
    })
  ],
  [
    'ENOBASEIMAGENAME',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No docker base image name specified.',
      details: `An [docker base image name](${linkify(
        'README.md#options'
      )}) must be set \`baseImageName\` in in plugin config.`
    })
  ],
  [
    'ENOIMAGENAME',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No docker image name specified.',
      details: `An [docker image name](${linkify(
        'README.md#options'
      )}) must be set \`imageName\` in \`registries\`.`
    })
  ],
  [
    'EDOCKERLOGIN',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'Error login to docker registry.',
      details: 'Try login to docker registry.'
    })
  ],
  [
    'EDOCKERIMAGETAG',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'Error tag docker image.',
      details: 'Error tag docker image. Check credentials in `registries`.'
    })
  ],
  [
    'EDOCKERIMAGEPUSH',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'Error tag docker push.',
      details: 'Error tag docker push. Check credentials in `registries`.'
    })
  ],
  [
    'ESKIPTAGSNOTANARRAY',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'Invalid registry config.',
      details: 'Invalid registry config. 1 or more `registry` config contains the `skipTags` property but it is not an array. Please check it.'
    })
  ]
])
/* eslint-enable sonarjs/no-duplicate-string */
