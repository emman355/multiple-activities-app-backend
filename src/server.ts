import 'dotenv/config'; // Load .env variables

import express from 'express';
import cors from 'cors';
import { todoRouter } from "./todos/todo.routes.js";
// --- CONFIGURATION ---
const app = express();
const port = 3001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRouter);

// --- SERVER STARTUP ---
app.get('/', (_, res) => res.send('Hello from Vercel!'));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});