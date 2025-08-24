import { pagination } from "prisma-extension-pagination";
import { PrismaClient as BasePrismaClient } from "../generated/prisma";

const ExtendedPrismaClient = new BasePrismaClient().$extends(
  pagination({
    pages: {
      includePageCount: true,
    },
  })
);

type PrismaClient = typeof ExtendedPrismaClient;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || ExtendedPrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
