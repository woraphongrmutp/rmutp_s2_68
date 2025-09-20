import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { encrypt, decrypt } from "./utils/crypto";

const app = new Hono();
const prisma = new PrismaClient();

// GET all profiles
app.get("/profile", async (c) => {
  const profiles = await prisma.profile.findMany();
  return c.json(profiles);
});

// GET profile by id
app.get("/profile/:id", async (c) => {
  const id = c.req.param("id");
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) return c.json({ error: "Profile not found" }, 404);

  return c.json({
    ...profile,
    mobile: profile.mobile ? decrypt(profile.mobile) : null,
    cardId: profile.cardId ? decrypt(profile.cardId) : null,
  });
});

// POST profile
app.post("/profile", async (c) => {
  const { username, password, mobile, cardId } = await c.req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newProfile = await prisma.profile.create({
    data: {
      username,
      password: hashedPassword,
      mobile: mobile ? encrypt(mobile) : "",
      cardId: cardId ? encrypt(cardId) : "",
    },
  });

  return c.json(newProfile);
});

// POST /encode ทำเหมือน POST /profile แต่ชื่อ endpoint เป็น /encode
app.post("/encode", async (c) => {
  const { username, password, mobile, cardId } = await c.req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newProfile = await prisma.profile.create({
    data: {
      username,
      password: hashedPassword,
      mobile: mobile ? encrypt(mobile) : "",
      cardId: cardId ? encrypt(cardId) : "",
    },
  });

  return c.json(newProfile);
});

// GET /decode/:id ทำเหมือน GET /profile/:id
app.get("/decode/:id", async (c) => {
  const id = c.req.param("id");
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) return c.json({ error: "Profile not found" }, 404);

  return c.json({
    ...profile,
    mobile: profile.mobile ? decrypt(profile.mobile) : null,
    cardId: profile.cardId ? decrypt(profile.cardId) : null,
  });
});

export default app;
