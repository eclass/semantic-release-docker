# @eclass/semantic-release-docker

[![npm](https://img.shields.io/npm/v/@eclass/semantic-release-docker.svg)](https://www.npmjs.com/package/@eclass/semantic-release-docker)
[![build](https://img.shields.io/travis/eclass/semantic-release-docker.svg)](https://travis-ci.org/eclass/semantic-release-docker)
[![downloads](https://img.shields.io/npm/dt/@eclass/semantic-release-docker.svg)](https://www.npmjs.com/package/@eclass/semantic-release-docker)
[![dependencies](https://img.shields.io/david/eclass/semantic-release-docker.svg)](https://david-dm.org/eclass/semantic-release-docker)
[![devDependency Status](https://img.shields.io/david/dev/eclass/semantic-release-docker.svg)](https://david-dm.org/eclass/semantic-release-docker#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/eclass/semantic-release-docker/badge.svg?branch=master)](https://coveralls.io/github/eclass/semantic-release-docker?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/f84f0bcb39c9a5c5fb99/maintainability)](https://codeclimate.com/github/eclass/semantic-release-docker/maintainability)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> [semantic-release](https://github.com/semantic-release/semantic-release) plugin to deploy app

| Step               | Description                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------|
| `verifyConditions` | Verify the presence of the `CI_REGISTRY_USER`, or `DOCKER_REGISTRY_USER`, `DOCKER_REGISTRY_PASSWORD` or `CI_REGISTRY_PASSWORD`, `CI_REGISTRY` or `CI_REGISTRY`, and `CI_REGISTRY_IMAGE` environment variable. |
| `prepare`          | Tag docker images.                                                                   |
| `publish`          | Push docker images.                                                                   |

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

### Environment variables

| Variable             | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `CI_REGISTRY_USER` | username for docker in gitlab ci. Only required if push images to gitlab docker registry. |
| `CI_REGISTRY_PASSWORD` | password for docker in gitlab ci. Only required if push images to gitlab docker registry. |
| `CI_REGISTRY` | registry for docker in gitlab ci. Only required if push images to gitlab docker registry. |
| `CI_REGISTRY_IMAGE` | image name for docker in gitlab ci. Only required if push images to gitlab docker registry. |
| `DOCKER_REGISTRY_USER` | username for generic docker. |
| `DOCKER_REGISTRY_PASSWORD` | password for generic docker. |
| `DOCKER_REGISTRY` | registry for generic docker. Optional. Its posible set in config plgin |
| `AWS_ACCESS_KEY_ID` | aws access key for get docker credentials from ecr. Optional. Only use if push images to ecr |
| `AWS_SECRET_ACCESS_KEY` | aws secret key for get docker credentials from ecr. Optional. Only use if push images to ecr |
| `AWS_REGION` | aws region for get docker credentials from ecr. Optional. Only use if push images to ecr |

### Examples

In Gitlab CI
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

Push images to other docker registry
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
        "registryUrl": "registry.example.com",
        "imageName": "registry.example.com/myapp"
      }
    ]
  ]
}
```

Push images to aws ecr
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
        "ecr": true,
        "imageName": "1111.dkr.ecr.us-east-1.amazonaws.com/myapp"
      }
    ]
  ]
}
```

Push images with aditional tags
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
        "ecr": true,
        "imageName": "1111.dkr.ecr.us-east-1.amazonaws.com/myapp",
        "additionalTags": [
          "next",
          "beta"
        ]
      }
    ]
  ]
}
```

Push images to aditional registries
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
        "ecr": true,
        "imageName": "1111.dkr.ecr.us-east-1.amazonaws.com/myapp",
        "additionalRepos": [
          "registry.example.com"
        ]
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
  - "12"
stages:
  - test
  - name: deploy
    if: branch = master
jobs:
  include:
    - stage: test
      script: npm t
    - stage: deploy
      script: npx semantic-release

```

## License

[MIT](https://tldrlegal.com/license/mit-license)
