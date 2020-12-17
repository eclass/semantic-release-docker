const path = require('path')
const execa = require('execa')
const debug = require('debug')(
  'semantic-release:@eclass/semantic-release-docker:prepare'
)

/**
 * @typedef {import('./types').Config} Config
 * @typedef {import('./types').Context} Context
 */
/**
 * @param {Config} pluginConfig -
 * @param {Context} ctx -
 * @returns {Promise<string>} -
 * @example
 * const imageSha = await build(options)
 */
const build = async (pluginConfig, ctx) => {
  const baseImageTag = pluginConfig.baseImageTag || 'latest'
  const buildArgs = pluginConfig.buildArgs || []
  const args = buildArgs.reduce((acc, curr) => {
    const [key, value] = curr.trim().split('=')
    if (key && value) {
      acc.push('--build-arg', `${key}=${value}`)
    }
    return acc
  }, [])
  if (pluginConfig.cacheFrom) args.push('--cache-from', pluginConfig.cacheFrom)
  const cmd = [
    'build',
    '--quiet',
    '--tag',
    `${pluginConfig.baseImageName}:${baseImageTag}`,
    ...args,
    '-f',
    path.resolve(ctx.cwd, pluginConfig.dockerfile || 'Dockerfile'),
    path.resolve(ctx.cwd, pluginConfig.context || '.')
  ]
  debug('build command', cmd)
  const result = execa('docker', cmd, { cwd: ctx.cwd, env: ctx.env })
  result.stdout.pipe(ctx.stdout)
  result.stderr.pipe(ctx.stderr)
  const { stdout } = await result
  return stdout
}

module.exports = build
