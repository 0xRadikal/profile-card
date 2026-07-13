import { startServer } from './server.mjs';
const port = process.env.PORT || 3000;
await startServer(Number(port));
console.log('serving /profile-card/ on port ' + port);
