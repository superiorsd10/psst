-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "pastes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tags" TEXT[],
    "visibility" "Visibility" NOT NULL,
    "expiration_time" TIMESTAMP(3),
    "is_secured" BOOLEAN NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number_of_clicks" INTEGER NOT NULL DEFAULT 0,
    "checksum_crc" TEXT,
    "content_size" INTEGER NOT NULL,

    CONSTRAINT "pastes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pastes" ADD CONSTRAINT "pastes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
