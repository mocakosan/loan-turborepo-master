/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `enterprisers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enterprisers_phone_number_key" ON "enterprisers"("phone_number");
