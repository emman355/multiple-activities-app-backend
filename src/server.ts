import 'dotenv/config'; // Load .env variables

import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { todoRouter } from './api/todos/todo.routes.js';
import { foodReviewRouter } from './api/food/foodReview.routes.js';
import pokemonReviewRouter from './api/pokemon/pokemonReview.routes.js';
import { driveLiteRouter } from './api/drive-lite/driveLite.routes.js';
import { notesRouter } from './api/notes/notes.routes.js';
// --- CONFIGURATION ---
const app = express();
const port = 3001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRouter);
app.use("/api/food-review", foodReviewRouter);
app.use("/api/pokemon-review", pokemonReviewRouter)
app.use("/api/drive-lite", driveLiteRouter)
app.use("/api/notes", notesRouter);

// Global error handler (must be last)
app.use(errorMiddleware);

// --- SERVER STARTUP ---
app.get('/', (_, res) => res.send('Hello from Vercel!'));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});