import express, { Request, Response } from 'express';

const app = express();

app.get('/users', (req: Request, res: Response) => {
  res.json(['Vitor', 'Rayza'])
})

app.listen(3333);
