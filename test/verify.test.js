const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')
const nock = require('nock')

describe('Verify', () => {
  const env = {
    CI_REGISTRY_USER: 'bar',
    CI_REGISTRY_PASSWORD: 'bar',
    CI_REGISTRY: 'bar',
    CI_REGISTRY_IMAGE: 'bar'
  }
  let verify

  before(() => {
    mock('awscred', {
      load: cb => {
        if (process.env.AWS_ACCESS_KEY_ID === 'error') {
          cb(new Error('error'))
        } else if (process.env.AWS_ACCESS_KEY_ID === 'region') {
          cb(null, {
            region: process.env.AWS_REGION
          })
        } else if (process.env.AWS_ACCESS_KEY_ID === 'secret') {
          cb(null, {
            credentials: {
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            },
            region: process.env.AWS_REGION
          })
        } else if (process.env.AWS_ACCESS_KEY_ID === 'id') {
          cb(null, {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID
            },
            region: process.env.AWS_REGION
          })
        } else if (process.env.AWS_ACCESS_KEY_ID === 'credentials') {
          cb(null, {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
          })
        } else {
          cb(null, {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            },
            region: process.env.AWS_REGION
          })
        }
      }
    })
    mock('aws4', {
      sign: (opts, credentials) => {
        if (!credentials) {
          return {
            body: 'body',
            hostname: 'amazon.com',
            method: 'method',
            path: '/error',
            headers: 'headers'
          }
        } else {
          return {
            body: 'body',
            hostname: 'amazon.com',
            method: 'method',
            path: '/ecr',
            headers: 'headers'
          }
        }
      }
    })
    // eslint-disable-next-line require-jsdoc
    class DockerMock {
      // eslint-disable-next-line require-jsdoc
      dockerode () {
        return new Promise(resolve => resolve())
      }
    }
    mock('dockerode', DockerMock)
    nock.disableNetConnect()
    nock('https://amazon.com')
      .post('/ecr')
      .reply(200, {
        authorizationData: [
          {
            authorizationToken: 'Zm9vOmJhcgo=',
            proxyEndpoint: 'https://1111.dkr.ecr.us-east-1.amazonaws.com'
          }
        ]
      })
      .post('/error')
      .replyWithError('server error')

    verify = require('../src/verify')
  })

  it('Verify login in gitlab ci', async () => {
    // @ts-ignore
    expect(await verify({}, { env })).to.be.a('undefined')
  })

  after(() => {
    mock.stopAll()
    nock.enableNetConnect()
  })
})
