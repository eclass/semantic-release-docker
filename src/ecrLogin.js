const https = require('https')

const aws4 = require('aws4')

/** @typedef {import('https').RequestOptions} RequestOptions */
/**
 * @typedef {Object} Credentials
 * @property {string} user
 * @property {string} pass
 * @property {string} registryUrl
 */
/**
 * @param {string} body -
 * @param {RequestOptions} options -
 * @returns {Promise<Credentials>} -
 * @example
 * await request(body, options)
 */
const request = (body, options) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = []
      if (res.statusCode !== 200) {
        return reject(new Error(`invalid statusCode ${res.statusCode}`))
      }
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const { authorizationData } = JSON.parse(
          Buffer.concat(chunks).toString()
        )
        const [user, pass] = Buffer.from(
          authorizationData[0].authorizationToken,
          'base64'
        )
          .toString()
          .split(':')
        resolve({ user, pass, registryUrl: authorizationData[0].proxyEndpoint })
      })
    })
    req.on('error', err => reject(err))
    req.write(body)
    req.end()
  })
}

/**
 * @param {string} accessKeyId -
 * @param {string} secretAccessKey -
 * @param {string} region -
 * @returns {Promise<Credentials>} -
 * @example
 * const { user, pass, registryUrl } = await login(accessKeyId, secretAccessKey, region)
 */
const login = (accessKeyId, secretAccessKey, region) => {
  const opts = {
    service: 'ecr',
    region,
    signQuery: false,
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target':
        'AmazonEC2ContainerRegistry_V20150921.GetAuthorizationToken'
    },
    body: '{}',
    path: '/'
  }

  const sign = aws4.sign(opts, { accessKeyId, secretAccessKey })

  return request(sign.body, {
    hostname: sign.hostname,
    port: 443,
    method: sign.method,
    path: sign.path,
    headers: sign.headers
  })
}

module.exports = login
