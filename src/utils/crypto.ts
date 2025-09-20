import * as crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// รับ key จาก .env
const SECRET_KEY = process.env.SECRET_KEY;

// ตรวจสอบความยาว
if (!SECRET_KEY || SECRET_KEY.length !== 32) {
  throw new Error(
    `SECRET_KEY must be 32 characters long for AES-256-GCM, got ${SECRET_KEY?.length ?? 0}`
  );
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

// เข้ารหัส
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY!, "utf8"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

// ถอดรหัส
export function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY!, "utf8"), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
