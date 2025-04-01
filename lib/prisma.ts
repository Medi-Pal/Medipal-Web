// setting up Prisma Client before querying our Database with Prisma ORM
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma