import express from 'express';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3333;


app.use(express.json());
app.use(express.urlencoded());
// app.use(express.static('public'));

app.use('/', routes);

app.use((req, res) => {
  res.redirect(301, '/home');
});

app.use((req, res) => {
  res.redirect(404, '/home');
});

app.use((err, req, res, next) => {
  res.status(500).json('something wrong');
});
app.listen(PORT, () => {
  console.log('Listen at http://localhost:3333')
});
