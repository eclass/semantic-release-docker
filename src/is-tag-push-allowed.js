/**
 * @typedef {import('./types').Registry} Registry
 */
/**
 * @param {string } tag -
 * @param {Registry} registry -
 * @returns {boolean} -
 * @example
 * isTagPushAllowed(tag, registry)
 */
const isTagPushAllowed = (tag, registry) => {
  if (!registry.skipTags) {
    return true
  }

  return !registry.skipTags.includes(tag)
}

module.exports = isTagPushAllowed
