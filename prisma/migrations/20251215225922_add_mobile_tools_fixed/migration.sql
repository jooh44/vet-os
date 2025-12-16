-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "mechanism" TEXT,
    "defaultDoseMgKg" DOUBLE PRECISION,
    "presentation" TEXT,
    "contraindications" TEXT[],
    "interactions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculationLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "result" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vetId" TEXT NOT NULL,

    CONSTRAINT "CalculationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalculationLog" ADD CONSTRAINT "CalculationLog_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
