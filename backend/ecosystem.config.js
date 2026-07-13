module.exports = {

  apps: [

    {

      name: "saveit-api",

      script: "./server.js",

      instances: "max",

      exec_mode: "cluster",

      watch: false,

      autorestart: true,

      max_memory_restart: "1G",

      env: {

        NODE_ENV: "development",

        PORT: 5000

      },

      env_production: {

        NODE_ENV: "production",

        PORT: 5000

      }

    }

  ]

};