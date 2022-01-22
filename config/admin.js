module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f28964dd36bec4bfe6126ff4b46daece'),
  },
});
