const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log(JSON.stringify({
    message:'Hello World Request!',
    time: new Date().toLocaleString(),
    situation:'situation'
  }));

  const target = process.env.TARGET || 'World';
  res.send(`Hello ${target}: image has been updated, add situation!`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});