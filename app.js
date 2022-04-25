const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ title: 'api object example weird2' });
});

// app.get('/test', (req, res) => {
//   res.send('Initial api test');
// });

app.listen(8080, () => {
  console.log('server initialized at 8080');
});
