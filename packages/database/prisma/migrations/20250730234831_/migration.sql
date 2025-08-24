/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `enterprisers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enterprisers_email_key" ON "enterprisers"("email");
