import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello World XXXX!"));

export default app;