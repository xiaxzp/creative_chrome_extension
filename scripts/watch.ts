import WebSocket, { WebSocketServer } from 'ws';

export default function rollupWatchReloadPlugin() {
  const wsInstance = new WebSocketServer({ port: 9999 });
  wsInstance.on('connection', (ws) => {
    ws.on('message', (data) => {
      console.log('received: %s', data);
    });
    ws.on('close', () => {
      console.log('disconnected');
    });
  });
  return {
    name: 'my-watch-reload-plugin', // this name will show up in warnings and errors
    async writeBundle() {
      console.log('bundle end');
      console.log('wss send');
      wsInstance.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('reload');
        }
      });
    },
    watchChange(id: string, change: { event: 'create' | 'update' | 'delete' }) {
      console.log('watch', id, change);
      // other ids should be handled as usually
    },
    closeWatcher() {
      console.log('close watch');
    },
  };
}
