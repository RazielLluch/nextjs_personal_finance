import { connection } from "next/server"
import { prisma } from "@src/server/db"
import { serializeTransaction } from "@src/server/db/transactions"
import { toTransactionTableRows } from "@src/features/transactions/types"
import { TransactionsPage } from "./transactions-page"

const transactionInclude = { transaction_item: true } as const

export default async function Page() {
  await connection()

  const transactions = await prisma.transaction.findMany({
    include: transactionInclude,
    orderBy: { date: "desc" },
  })
  const types = await prisma.$queryRaw<Array<{ id: bigint; type: string }>>`
    SELECT id, type FROM "public"."transaction"
  `
  const typeById = new Map(types.map((item) => [item.id.toString(), item.type]))

  const data = toTransactionTableRows(
    transactions.map((transaction) =>
      serializeTransaction(
        transaction,
        typeById.get(transaction.id.toString()) === "deposit"
          ? "deposit"
          : "payment",
      ),
    ),
  )

  return <TransactionsPage initialData={data} />
}
