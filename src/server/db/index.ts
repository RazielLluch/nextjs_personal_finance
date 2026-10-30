import {PrismaPg} from "@prisma/adapter-pg"
import {PrismaClient} from "@src/server/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL must be configured")
}

const adapter = new PrismaPg({connectionString})

function createPrismaClient() {
  const client = new PrismaClient({
    adapter,
    log: [{level: "query", emit: "event"}],
  })

  client.$on("query", (event) => {
    console.log("[prisma:query]", {
      query: event.query,
      params: event.params,
      duration: `${event.duration}ms`,
    })
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
