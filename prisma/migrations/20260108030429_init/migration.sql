-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INSPECTORIA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postulante" (
    "id" TEXT NOT NULL,
    "nro" INTEGER,
    "unidad" TEXT NOT NULL,
    "codPreinsc" TEXT NOT NULL,
    "nombrePostulante" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "fuenteArchivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Postulante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Postulante_codPreinsc_key" ON "Postulante"("codPreinsc");

-- CreateIndex
CREATE INDEX "Postulante_ci_idx" ON "Postulante"("ci");

-- CreateIndex
CREATE INDEX "Postulante_unidad_idx" ON "Postulante"("unidad");
