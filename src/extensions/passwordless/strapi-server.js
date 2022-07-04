
const { sanitize } = require('@strapi/utils');
const _ = require("lodash");
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = plugin => {

    async function createUser(user) {
        const role = await strapi
            .query('plugin::users-permissions.role')
            .findOne({
                where: { type: "authenticated" }
            });

        const newUser = {
            email: user.email,
            username: user.username,
            role: { id: role.id }
        };
        return strapi
            .query('plugin::users-permissions.user')
            .create({ data: newUser, populate: ['role'] });
    }

    async function fetchUser(data) {
        const userSchema = strapi.getModel('plugin::users-permissions.user');
        const user = await strapi.query('plugin::users-permissions.user').findOne({ where: data, populate: ['role'] })
        if (!user) {
            return user;
        }
        return await sanitize.sanitizers.defaultSanitizeOutput(userSchema, user);
    }

    plugin.controllers.auth.sendLink = async (ctx) => {
        const { passwordless } = strapi.plugins['passwordless'].services;

        const isEnabled = await passwordless.isEnabled();

        if (!isEnabled) {
            return ctx.badRequest('plugin.disabled');
        }

        const params = _.assign(ctx.request.body);

        const email = params.email ? params.email.trim().toLowerCase() : null;
        const context = params.context || {};
        const username = params.username || null;

        if (email && !emailRegExp.test(email)) {
            return ctx.badRequest('Invalid Email');
        }

        let user;
        const userByEmail = await fetchUser({ email })

        if (email && !username) {
            if (userByEmail) {
                user = userByEmail
            } else {
                return ctx.badRequest("Please signup to continue")
            }
        } else if (email && username) {
            const userByUsername = await fetchUser({ username })
            if (userByEmail && userByUsername && (userByEmail.id == userByUsername.id)) {
                user = userByUsername;
            } else if (userByEmail || userByUsername) {
                return ctx.badRequest('Email or username already taken')
            } else {
                user = await createUser({ email, username })
            }
        } else {
            return ctx.badRequest("Unknown Error")
        }

        try {
            const token = await passwordless.createToken(user.email, context);
            await passwordless.sendLoginLink(token);
            ctx.send({
                email,
                username,
                sent: true,
            });
        } catch (err) {
            return ctx.badRequest(err);
        }
    }

    return plugin;
}