-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "user" (
    "dbId" BIGSERIAL NOT NULL,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "deletedAt" TIMESTAMP(6),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',

    CONSTRAINT "user_dbid_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "dbId" BIGSERIAL NOT NULL,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "firstName" TEXT,
    "lastName" TEXT,
    "mobilePhone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "userDbId" BIGINT NOT NULL,

    CONSTRAINT "profile_dbid_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "session" (
    "dbId" BIGSERIAL NOT NULL,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userDbId" BIGINT NOT NULL,

    CONSTRAINT "session_dbid_pkey" PRIMARY KEY ("dbId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "user_profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userDbId_key" ON "user_profile"("userDbId");

-- CreateIndex
CREATE UNIQUE INDEX "session_id_key" ON "session"("id");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_dbid_fkey" FOREIGN KEY ("userDbId") REFERENCES "user"("dbId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "user_dbid_fkey" FOREIGN KEY ("userDbId") REFERENCES "user"("dbId") ON DELETE CASCADE ON UPDATE NO ACTION;
