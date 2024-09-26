export default function livereload() {
  if (typeof window === 'undefined') {
    return;
  }
  console.log('socket load');
  const socket = new WebSocket('ws://localhost:9999');
  socket.addEventListener('open', () => {
    console.log('opened');
    socket.send('socket opened!');
  });

  // Listen for messages
  socket.addEventListener('message', (event) => {
    console.log('Message from server ', event);
    if (event.data === 'reload') {
      window.location.reload();
    }
  });
}
