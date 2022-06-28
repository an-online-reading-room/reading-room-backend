'use strict';

/**
 *  story controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::story.story', ({ strapi }) => ({
  
  async random(ctx) {
    return strapi.service('api::story.story').random()
  }

}));
