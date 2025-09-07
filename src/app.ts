import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const app = new Hono();

app.get("/", (c) => c.text("Hello World 5555555"));
app.get("/profile", async (c) => {
    //get data from db
    const profiles = await prisma.profile.findMany();
    //response
    return c.json({
        message: "get data complete",
        data: profiles
    }, 200);
});    

export default app;