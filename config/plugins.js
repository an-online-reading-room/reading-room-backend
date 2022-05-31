module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 100000,
            },
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST'),
                port: env.int('SMTP_PORT'),
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                // ... any custom nodemailer options
            },
            settings: {
                defaultFrom: 'no-reply@thereadingroom.online',
                defaultReplyTo: 'no-reply@thereadingroom.online',
            },
        },
    },
});
