module.exports = plugin => {
    const sanitizeOutput = (user) => {
        const {
            password, resetPasswordToken, confirmationToken,
            provider, confirmed, blocked, createdAt,
            updatedAt, email, ...sanitizedUser
        } = user; // be careful, you need to omit other private attributes yourself
        return sanitizedUser;
    };
    const fetchUser = async (data) => {
        return await strapi.query('plugin::users-permissions.user').findOne({ where: data })
    }

    /** Controllers **/
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

    const bookmarks = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }
        const user = await strapi.entityService.findOne(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                populate: {
                    bookmarks: {
                        fields: ['id', 'slug', 'title', 'location', 'description']
                    },
                },
            }
        );
        ctx.body = sanitizeOutput(user);
    }

    const bookmarkupdate = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }
        const {bookmarks} = await strapi.entityService.findOne(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                populate: {
                    bookmarks: {
                        fields: ['id']
                    },
                },
            }
        );
        console.log(ctx.body.data)
        console.log(bookmarks)
        const user = await strapi.entityService.update(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                data: {
                    bookmarks
                }
            }
        )
        ctx.body = sanitizeOutput(user);
    }

    const updateMe = async (ctx) => {
        if (!ctx.state.user) {
            return ctx.unauthorized();
        }
        const { email, username } = ctx.request.body;
        if (username) {
            const user = await fetchUser({ username })

            if (user) {
                return ctx.badRequest("Username already exists")
            }
        } else if (email) {
            const user = await fetchUser({ email })
            if (user) {
                return ctx.badRequest("Email already exists")
            }
        }
        const newuser = await strapi.entityService.update(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {
                data: {
                    email, username
                }
            }
        );
        ctx.body = sanitizeOutput(newuser);
    }

    /** New User routes **/
    const userStoriesRoute = {
        method: 'GET',
        path: '/users/stories',
        handler: 'user.stories',
        config: { prefix: '' }
    }

    const updateUserRoute = {
        method: 'PUT',
        path: '/users/update',
        handler: 'user.updateMe',
        config: { prefix: '' }
    }
    const userBookmarksRoute = {
        method: 'GET',
        path: '/users/bookmarks',
        handler: 'user.bookmarks',
        config: { prefix: '' }
    }
    const userBookmarksUpdateRoute = {
        method: 'PUT',
        path: '/users/bookmarks',
        handler: 'user.bookmarkupdate',
        config: { prefix: '' }
    }

    /** Add new routes and controllers to user **/
    plugin.routes['content-api'].routes.splice(10, 0, userStoriesRoute);
    plugin.routes['content-api'].routes.splice(10, 0, updateUserRoute);
    plugin.routes['content-api'].routes.splice(10, 0, userBookmarksRoute);
    plugin.routes['content-api'].routes.splice(10, 0, userBookmarksUpdateRoute);

    plugin.controllers.user['stories'] = stories;
    plugin.controllers.user['updateMe'] = updateMe;
    plugin.controllers.user['bookmarks'] = bookmarks;
    plugin.controllers.user['bookmarkupdate'] = bookmarkupdate;


    /** Extend user/me controller */
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
