-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "public"."Profile"("username");
