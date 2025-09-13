import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const app = new Hono();

// GET: ดึง profile ทั้งหมด
app.get("/profile", async (c) => {
  const profiles = await prisma.profile.findMany();
  return c.json(profiles);
});

// GET: ดึง profile ตาม id
app.get("/profile/:id", async (c) => {
  const id = c.req.param("id");
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) return c.json({ error: "Profile not found" }, 404);
  return c.json(profile);
});

// POST: สร้าง profile ใหม่
app.post("/profile", async (c) => {
  const body = await c.req.json();
  const { username, password, mobile, cardId } = body;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const profile = await prisma.profile.create({
      data: { username, password: hashedPassword, mobile, cardId },
    });
    return c.json(profile, 201);
  } catch (err) {
    return c.json({ error: "Cannot create profile", details: err }, 400);
  }
});

// PUT: แก้ไข profile
app.put("/profile/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { username, password, mobile, cardId } = body;

  const updateData: any = { username, mobile, cardId };
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const profile = await prisma.profile.update({
      where: { id },
      data: updateData,
    });
    return c.json(profile);
  } catch (err) {
    return c.json({ error: "Cannot update profile", details: err }, 400);
  }
});

// DELETE: ลบ profile
app.delete("/profile/:id", async (c) => {
  const id = c.req.param("id");

  try {
    await prisma.profile.delete({ where: { id } });
    return c.json({ message: "Profile deleted" });
  } catch (err) {
    return c.json({ error: "Cannot delete profile", details: err }, 400);
  }
});

export default app;
