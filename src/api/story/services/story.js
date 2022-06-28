'use strict';

/**
 * story service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::story.story', ({ strapi }) => ({

  // find a random story
  async random(...args) {

    try {
      const knex = strapi.db.connection
      
      const record = await knex
      .select('id', 'title', 'location', 'description', 'submission', 'published_at as publishedAt')
      .from('stories')
      .orderByRaw('random()')
      .limit(1)

      console.log()

      console.log(`random() record: ${record[0].id}`)

      return record[0]
    } catch(err) {
      return null
    }

  }

}));
