module.exports = plugin => {
    const sanitizeOutput = (user) => {
        const {
            password, resetPasswordToken, confirmationToken,
            provider, confirmed, blocked, createdAt,
            updatedAt, email, ...sanitizedUser
        } = user; // be careful, you need to omit other private attributes yourself
        return sanitizedUser;
    };

    const stories = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }
        const user = await strapi.entityService.findOne(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                populate: {
                    stories: {
                        fields: ['id', 'slug', 'title', 'location', 'description', 'publishedAt', 'hasDraft']
                    },
                },
            }
        );
        ctx.body = sanitizeOutput(user);
    }

    const userStoriesRoute = {
        method: 'GET',
        path: '/users/stories',
        handler: 'user.stories',
        config: { prefix: '' }
    }

    plugin.routes['content-api'].routes.splice(10, 0, userStoriesRoute);
    plugin.controllers.user['stories'] = stories;

    plugin.controllers.user.me = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }
        const user = await strapi.entityService.findOne(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                populate: {
                    stories: {
                        fields: ['id', 'slug', 'title', 'location', 'description', 'publishedAt']
                    },
                    maps: {
                        filters: {
                            title: {
                                $eq: null,
                            },
                            type: {
                                $eq: "lite"
                            }
                        }
                    }
                },
            }
        );
        ctx.body = sanitizeOutput(user);
    };
    return plugin;
};
