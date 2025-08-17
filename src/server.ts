import { serve } from "@hono/node-server";
import app from "./app.js"; // ต้องเป็น .js เพราะ Node ESM จะ resolve แบบนี้จริง ๆ

serve({
  fetch: app.fetch,
  port: 3000,
});


