module.exports = {
  apps: [
    {
      name: 'dokoexp',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      node_args: '--experimental-modules',
      interpreter: 'node',
      interpreter_args: '--experimental-modules --es-module-specifier-resolution=node'
    }
  ]
}; 