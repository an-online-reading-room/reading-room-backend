const { sanitize } = require('@strapi/utils');

module.exports = plugin => {
    strapi.log.info("DBG: My plugin extension getting picked up")
    //console.log(plugin)
    const ogServices = plugin.services.passwordless;

    async function createUser(user) {
        //const userSettings = await this.userSettings();
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

    plugin.services.passwordless = ({ strapi }) => {
        return {
            ...ogServices({ strapi }),

            user: async (email, username) => {
                // return new value
                strapi.log.info("DBG: My plugin service user getting picked up")

                if (email && username) {

                    const userByEmail = await fetchUser({ email })
                    const userByUsername = await fetchUser({ username });

                    if (userByEmail.id == userByUsername.id) {
                        return userByEmail;
                    }
                    if (userByEmail) {
                        console.log("Email already associated with another account")
                        console.log(userByEmail.id)
                        return false;
                    }
                    if (userByUsername) {
                        console.log("Username not available")
                        console.log(userByUsername.id)
                        return false;
                    }
                    return createUser({ email, username })

                } else if (email && !username) {
                    const userByEmail = await fetchUser({ email })
                    if (user) {
                        return user;
                    } else {
                        console.log("Account doesn't exist")
                        return false;
                    }
                }
                //const user = email ? await fetchUser({ email }) : null;
                //console.log(user)
                /*if (user) {
                    return user;
                }
                const userByUsername = username ? await fetchUser({ username }) : null;
                if (userByUsername) {
                    return userByUsername
                }
                if (email && username) {
                    //console.log("are we hitting this")
                    return createUser({ email, username })
                }
                */
                return false;
            },

        }
    }

    return plugin;
}