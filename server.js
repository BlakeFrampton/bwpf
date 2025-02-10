const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Serve main site from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/projects', express.static(path.join(__dirname, 'projects')));

// if (process.env.NODE_ENV === 'development') {
//   // For the "shufflefy" project, proxy requests to the React dev server on port 3001
//   app.use('/projects/shufflefy', createProxyMiddleware({
//     target: 'http://localhost:3001',
//     changeOrigin: true,
//   }));
//   // (Optional) Also support the root-level URL if desired:
//   app.use('/shufflefy', createProxyMiddleware({
//     target: 'http://localhost:3001',
//     changeOrigin: true,
//   }));
// } else {
//   // In production, serve the built React app from projects/shufflefy
//   app.use(
//     '/projects/shufflefy/static',
//     express.static(path.join(__dirname, 'projects', 'shufflefy', 'static'))
//   );
//   app.get('/projects/shufflefy*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'projects', 'shufflefy', 'index.html'));
//   });
// }

// Fallback for the main site
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
