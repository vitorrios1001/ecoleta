import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';
require('dotenv').config()

const app = express();

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333);
