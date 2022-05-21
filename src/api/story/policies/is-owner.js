'use strict';

/**
 * `isOwner` policy.
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info('In isOwner policy.');
  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
