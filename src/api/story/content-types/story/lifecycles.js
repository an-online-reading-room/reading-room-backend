module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.title) {
      data.slug = await strapi.plugins[
        "content-manager"
      ].services.uid.generateUIDField({
        contentTypeUID: "api::story.story",
        field: "slug",
        data,
      });
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    if (data.title) {
      data.slug = await strapi.plugins[
        "content-manager"
      ].services.uid.generateUIDField({
        contentTypeUID: "api::story.story",
        field: "slug",
        data,
      });
    }
  },
};
