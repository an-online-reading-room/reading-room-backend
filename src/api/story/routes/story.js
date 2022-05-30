'use strict';

/**
 * story router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::story.story', {
  config: {
    create: {
      policies: ['is-owner'],
      middlewares: [],
    }
  }
});
