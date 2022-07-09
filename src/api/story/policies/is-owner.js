'use strict';

/**
 * `isOwner` policy.
 */

module.exports = (policyContext, config, { strapi }) => {
  // Add your own logic here.
  //strapi.log.info('In isOwner policy.');
  if (policyContext.state.user.id == policyContext.request.body.data.user) {
    return true;
  }

  return false;
};
