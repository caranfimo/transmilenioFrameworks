#!/usr/bin/env node

/**
 * Module dependencies.
 */
import debugLib from 'debug';
// @ts-ignore|
import http from 'http';
import app from '../app';

const debug = debugLib('bdb:server');
let server: http.Server | undefined;
let port: string | number | false;

(async () => {
  try {
    /**
     * Get port from environment and store in Express.
     */
    port = normalizePort('3500');
    app.set('port', port);
    debug('Port set to:', port);
    /**
     * Create HTTP server.
     */
    server = http.createServer(app);
    debug('Server created');

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    debug('[ERROR] Could not start application: ', error);
  }
})();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const nPort = parseInt(val, 10);
  if (isNaN(nPort)) {
    return val;
  }
  if (nPort >= 0) {
    return nPort;
  }
  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening() {
  const addr = (server as http.Server).address();
  const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${(addr as any).port}`;
  debug(`Listening on ${bind}`);
}

export default server;
