const Dockerode = require('dockerode')

/**
 * @param {string} username -
 * @param {string} password -
 * @param {string} serveraddress -
 * @returns {Promise<*>} -
 * @example
 * const valid = await login(user, pass, registryUrl)
 */
const login = (username, password, serveraddress) => {
  const docker = new Dockerode()
  return docker.checkAuth({ password, serveraddress, username })
}

module.exports = login
