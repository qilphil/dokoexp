# Running DokoExp with PM2

This document provides instructions on how to run the DokoExp application using PM2, a production process manager for Node.js applications.

## What is PM2?

PM2 is a daemon process manager that helps you manage and keep your application online 24/7. It offers features like:

- Process management (start, stop, restart)
- Log management
- Monitoring
- Clustering
- Automatic restarts after crashes
- Load balancing

## Installation

PM2 is already included as a development dependency in this project. If you need to install it globally, run:

```bash
npm install -g pm2
```

## Available Scripts

The following npm scripts are available for managing the application with PM2:

- `npm run pm2:start` - Start the application using PM2
- `npm run pm2:stop` - Stop the application
- `npm run pm2:restart` - Restart the application
- `npm run pm2:reload` - Reload the application with zero downtime
- `npm run pm2:delete` - Delete the application from PM2
- `npm run pm2:logs` - Display logs from the application
- `npm run pm2:monitor` - Open the PM2 monitoring dashboard
- `npm run pm2:status` - Show the status of all applications managed by PM2
- `npm run pm2:prod` - Start the application in production mode

## Configuration

The PM2 configuration is defined in the `ecosystem.config.cjs` file. This file includes settings for:

- Application name
- Script to run
- Number of instances
- Environment variables
- Restart behavior
- Memory limits

## Running in Production

To run the application in production mode:

```bash
npm run pm2:prod
```

This will start the application with the production environment variables defined in the ecosystem.config.cjs file.

## Monitoring

To monitor the application:

```bash
npm run pm2:monitor
```

This will open the PM2 monitoring dashboard, which provides real-time information about CPU usage, memory consumption, request handling, and more.

## Log Management

PM2 automatically manages logs for your application. To view logs in real-time:

```bash
npm run pm2:logs
```

## Startup Script

To ensure that your application starts automatically after a server reboot, you can generate and configure a startup script:

```bash
pm2 startup
```

Follow the instructions provided by the command to set up the startup script.

## Saving the Process List

After configuring your applications with PM2, save the process list so it can be restored later:

```bash
pm2 save
```

This will save the list of processes to be restored on server restart.

## Additional PM2 Commands

For more advanced usage, you can use PM2 directly:

- `pm2 list` - List all running applications
- `pm2 show dokoexp` - Display detailed information about the application
- `pm2 reload all` - Reload all applications
- `pm2 flush` - Flush all logs
- `pm2 startup` - Generate a startup script
- `pm2 save` - Save the current process list
- `pm2 resurrect` - Restore previously saved processes

## Troubleshooting

If you encounter issues with PM2 and ES modules, try the following:

1. Make sure your Node.js version supports ES modules
2. Use the `--experimental-modules` flag if needed
3. Check PM2 logs for specific error messages
4. Try running the application directly with `node server.js` to verify it works without PM2 