export default function(url: string | null): WebSocket | null {
  if (url) {
    let ws = new WebSocket(url);
    return ws;
  }
  return null;
}
