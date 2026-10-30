import { PrismaClient } from '@src/server/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

// 1. Create the PostgreSQL adapter with your direct URL
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL!,
})

// 2. Pass the adapter into PrismaClient
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🔄 Connecting to Supabase via Prisma...')
  const userCount = await prisma.users.count()
  console.log(`✅ Successfully connected! Found ${userCount} users in auth.users.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
