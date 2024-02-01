import { PrismaClient } from '@prisma/client'
declare global {
  /* eslint-disable no-var */
  var __prisma: PrismaClient
}
if (!global.__prisma) {
  global.__prisma = new PrismaClient({ log: ['query', 'info'] })
}
global.__prisma.$connect()
export const prisma = global.__prisma
