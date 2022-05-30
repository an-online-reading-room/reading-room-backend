const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  const config = parse(env("DATABASE_URL"));

  return {
    
    defaultConnection: "default",
    connections: {
      default: {
        connector: "bookshelf",
        settings: {
          client: "postgres",
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.user,
          password: config.password,
        },
      },
    },
  };
};