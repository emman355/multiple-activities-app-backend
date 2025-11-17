import 'dotenv/config'; // Load .env variables

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// --- CONFIGURATION ---
const app = express();
const port = 3001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- SERVER STARTUP ---
app.get('/', (_, res) => res.send('Hello from Vercel!'));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});