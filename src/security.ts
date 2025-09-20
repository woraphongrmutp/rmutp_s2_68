import * as crypto from "crypto";

// รับ SECRET_KEY จาก environment variable
const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not set");
}

// ใช้ ! เพื่อบอก TypeScript ว่า SECRET_KEY ไม่เป็น undefined
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

// ฟังก์ชันเข้ารหัสข้อความ
export function encrypt(text: string): string {
  const iv: Buffer = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY!), iv);
  let encrypted: string = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag: string = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

// ฟังก์ชันถอดรหัสข้อความ
export function decrypt(encryptedText?: string): string {
  if (!encryptedText) return "";
  const parts: string[] = encryptedText.split(":");
  if (parts.length !== 3) return "";

  const [ivHex, tagHex, encrypted] = parts;
  const iv: Buffer = Buffer.from(ivHex, "hex");
  const tag: Buffer = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY!), iv);
  decipher.setAuthTag(tag);

  let decrypted: string = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ฟังก์ชัน encode / decode สำหรับ API
export function encode(text: string): string {
  if (!text) return "";
  return encrypt(text);
}

export function decode(encryptedText: string): string {
  if (!encryptedText) return "";
  return decrypt(encryptedText);
}
