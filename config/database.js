module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'reading-room'),
      user: env('DATABASE_USERNAME', 'reading-room'),
      password: env('DATABASE_PASSWORD', 'reading'),
      // ssl: env.bool('DATABASE_SSL', true),
    },
  },
});