module.exports = ({ env }) => ({
  host: "0.0.0.0",
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
  },
});