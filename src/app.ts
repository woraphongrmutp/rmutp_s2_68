import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { encrypt, decrypt } from "./utils/crypto";

const prisma = new PrismaClient();
const app = new Hono();

// GET: ดึง profile ทั้งหมด (ถอดรหัส mobile, cardId ก่อนส่ง)
app.get("/profile", async (c) => {
  const profiles = await prisma.profile.findMany();
  const decryptedProfiles = profiles.map((p) => ({
    ...p,
    mobile: decrypt(p.mobile),
    cardId: decrypt(p.cardId),
  }));
  return c.json(decryptedProfiles);
});

// GET: ดึง profile ตาม id
app.get("/profile/:id", async (c) => {
  const id = c.req.param("id");
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) return c.json({ error: "Profile not found" }, 404);

  return c.json({
    ...profile,
    mobile: decrypt(profile.mobile),
    cardId: decrypt(profile.cardId),
  });
});

// POST: สร้าง profile ใหม่ (hash password + encrypt mobile, cardId)
app.post("/profile", async (c) => {
  const body = await c.req.json();
  const { username, password, mobile, cardId } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const profile = await prisma.profile.create({
      data: {
        username,
        password: hashedPassword,
        mobile: encrypt(mobile),
        cardId: encrypt(cardId),
      },
    });
    return c.json(profile, 201);
  } catch (err) {
    return c.json({ error: "Cannot create profile", details: String(err) }, 400);
  }
});

// PUT: แก้ไข profile (encrypt ถ้ามี mobile หรือ cardId)
app.put("/profile/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { username, password, mobile, cardId } = body;

  const updateData: any = {};
  if (username) updateData.username = username;
  if (mobile) updateData.mobile = encrypt(mobile);
  if (cardId) updateData.cardId = encrypt(cardId);
  if (password) updateData.password = await bcrypt.hash(password, 10);

  try {
    const profile = await prisma.profile.update({
      where: { id },
      data: updateData,
    });
    return c.json(profile);
  } catch (err) {
    return c.json({ error: "Cannot update profile", details: String(err) }, 400);
  }
});

// DELETE: ลบ profile
app.delete("/profile/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await prisma.profile.delete({ where: { id } });
    return c.json({ message: "Profile deleted" });
  } catch (err) {
    return c.json({ error: "Cannot delete profile", details: String(err) }, 400);
  }
});

// LOGIN: ตรวจสอบ username + password (ถอดรหัสข้อมูลก่อนส่งกลับ)
app.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const user = await prisma.profile.findUnique({ where: { username } });
  if (!user) return c.json({ error: "User not found" }, 404);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return c.json({ error: "Invalid password" }, 401);

  return c.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      mobile: decrypt(user.mobile),
      cardId: decrypt(user.cardId),
    },
  });
});

export default app;
