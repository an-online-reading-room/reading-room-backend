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

    const update = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }
        console.log(ctx.request.body)
        const {email, username } = ctx.request.body;
        const user = await strapi.entityService.update(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                data : {
                    email, username
                }
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

    const updateUserRoute = {
        method: 'PUT',
        path: '/users/update',
        handler: 'user.update',
        config: { prefix: '' }
    }

    plugin.routes['content-api'].routes.splice(10, 0, userStoriesRoute);
    plugin.routes['content-api'].routes.splice(10, 0, updateUserRoute);

    plugin.controllers.user['stories'] = stories;
    plugin.controllers.user['update'] = update;


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
