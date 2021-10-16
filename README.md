# @eclass/semantic-release-docker

[![npm](https://img.shields.io/npm/v/@eclass/semantic-release-docker.svg)](https://www.npmjs.com/package/@eclass/semantic-release-docker)
![Node.js CI](https://github.com/eclass/semantic-release-docker/workflows/Node.js%20CI/badge.svg)
[![downloads](https://img.shields.io/npm/dt/@eclass/semantic-release-docker.svg)](https://www.npmjs.com/package/@eclass/semantic-release-docker)
[![dependencies](https://img.shields.io/david/eclass/semantic-release-docker.svg)](https://david-dm.org/eclass/semantic-release-docker)
[![devDependency Status](https://img.shields.io/david/dev/eclass/semantic-release-docker.svg)](https://david-dm.org/eclass/semantic-release-docker#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/eclass/semantic-release-docker/badge.svg?branch=master)](https://coveralls.io/github/eclass/semantic-release-docker?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/88355a0bbb92e6a01834/maintainability)](https://codeclimate.com/github/eclass/semantic-release-docker/maintainability)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> [semantic-release](https://github.com/semantic-release/semantic-release) plugin to tag and push docker images

| Step               | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify the presence of the `baseImageName`, and `registries` options in plugin config. |
| `prepare`          | Tag docker images.                                                                     |
| `publish`          | Push docker images.                                                                    |

## Install

```bash
npm i -D @eclass/semantic-release-docker
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/caribou/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/gitlab",
    "@eclass/semantic-release-docker"
  ]
}
```

## Configuration

### Options

#### Config

| Variable         | Description |
| ---------------- | ----------- |
| `baseImageName`  | Name of the previously constructed docker image. Required. |
| `baseImageTag`   | Name of the previously constructed docker image tag. Optional. Default `"latest"` |
| `registries`     | Array of [Registry](#registry) objects. Required. Example: {"user": "DOCKER_USER", "password": "DOCKER_PASSWORD", "url": "docker.pkg.github.com", "imageName": "docker.pkg.github.com/myuser/myrepo/myapp"} |
| `additionalTags` | Array of additional tags to push. Optional. Example: `["beta", "next"]` |

#### Registry

| Variable         | Description |
| ---------------- | ----------- |
| url              | Url of the docker registry. Required. Example: `"docker.pkg.github.com"` |
| imageName        | Name of the docker image. Required. Example: `"docker.pkg.github.com/myuser/myrepo/myapp"` |
| user             | Name of the environment variable used as user name for login to the docker registry. Required. Example: `"DOCKER_USER"` |
| password         | Name of the environment variable used as password for login to the docker registry. Required. Example: `"DOCKER_PASSWORD"` |
| skipTags         | Array of image tags that should not be pushed to the docker registry. Optional. Example: `["latest"]` |

### Environment variables

Environment variables are variables. Depends of `registries` option.

| Variable                | Description                   |
| ----------------------- | ----------------------------- |
| `DOCKER_USER`           | username for docker registry. |
| `DOCKER_PASSWORD`       | password for docker registry. |
| `DOCKER_BASE_IMAGE_TAG` | Name of the previously constructed docker image tag. Optional. Default `"latest"`. |

### Examples

Push images to many docker registry

```json
{
  "plugins": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/gitlab",
    [
      "@eclass/semantic-release-docker",
      {
        "baseImageName": "myapp",
        "registries": [
          {
            "url": "registry.gitlab.com",
            "imageName": "registry.gitlab.com/mygroup/myapp",
            "user": "CI_REGISTRY_USER",
            "password": "CI_REGISTRY_PASSWORD"
          },
          {
            "url": "docker.io",
            "imageName": "docker.io/myuser/myapp",
            "user": "DOCKER_REGISTRY_USER",
            "password": "DOCKER_REGISTRY_PASSWORD"
          },
          {
            "url": "docker.pkg.github.com",
            "imageName": "docker.pkg.github.com/myuser/myrepo/myapp",
            "user": "GITHUB_USER",
            "password": "GITHUB_TOKEN"
          },
          {
            "url": "123456789012.dkr.ecr.us-east-1.amazonaws.com",
            "imageName": "123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp",
            "user": "AWS_DOCKER_USER",
            "password": "AWS_DOCKER_PASSWORD",
            "skipTags": ["latest"]
          }
        ],
        "additionalTags": ["next", "beta"]
      }
    ]
  ]
}
```

```yml
# .gitlab-ci.yml
release:
  image: node:alpine
  stage: release
  before_script:
    - docker build -t myapp .
  script:
    - npx semantic-release
  only:
    - master
```

```yml
# .travis.yml
language: node_js
cache:
  directories:
    - ~/.npm
node_js:
  - '12'
stages:
  - test
  - name: deploy
    if: branch = master
jobs:
  include:
    - stage: test
      script: npm t
    - stage: deploy
      before_script: docker build -t myapp .
      script: npx semantic-release
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
