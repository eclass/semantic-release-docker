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
    'ENODOCKERUSER',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No docker username specified.',
      details: `An [docker username](${linkify(
        'README.md#environment-variables'
      )}) must be created and set in the \`CI_REGISTRY_USER\` or \`DOCKER_REGISTRY_USER\` environment variable on your CI environment.`
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
      )}) must be created and set in the \`CI_REGISTRY_PASSWORD\` or \`DOCKER_REGISTRY_PASSWORD\` environment variable on your CI environment.`
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
        'README.md#environment-variables'
      )}) must be created and set in the \`CI_REGISTRY\`, \`DOCKER_REGISTRY\` environment variable on your CI environment or set \`registryUrl\`. in plugin config`
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
        'README.md#environment-variables'
      )}) must be created and set in the \`CI_REGISTRY_IMAGE\` environment variable on your CI environment or set \`imageName\`. in plugin config`
    })
  ],
  [
    'ENOAWSACCESSKEYID',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No aws access key specified.',
      details: `An [aws access key](${linkify(
        'README.md#environment-variables'
      )}) must be created and set in the \`AWS_ACCESS_KEY_ID\` environment variable on your CI environment.`
    })
  ],
  [
    'ENOAWSSECRETACCESSKEY',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No aws secret key specified.',
      details: `An [aws secret key](${linkify(
        'README.md#environment-variables'
      )}) must be created and set in the \`AWS_SECRET_ACCESS_KEY\` environment variable on your CI environment.`
    })
  ],
  [
    'ENOAWSREGION',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No aws region specified.',
      details: `An [aws region](${linkify(
        'README.md#environment-variables'
      )}) must be created and set in the \`AWS_REGION\` environment variable on your CI environment.`
    })
  ],
  [
    'EECRLOGIN',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'Error retrive ecr credentials.',
      details: 'Try get docker credentials from ecr.'
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
      details: 'Error tag docker image.'
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
      details: 'Error tag docker push.'
    })
  ]
])
/* eslint-enable sonarjs/no-duplicate-string */
