import {NextResponse} from "next/server"
import {prisma} from "@src/server/db"
import {
  parseAmount,
  parseBigInt,
  parseDate,
  parseTransactionType,
  serializeTransaction,
} from "@src/server/db/transactions"

const transactionInclude = {transaction_item: true} as const

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    include: transactionInclude,
    orderBy: {date: "desc"},
  })
  const types = await prisma.$queryRaw<Array<{ id: bigint; type: string }>>`
    SELECT id, type FROM "public"."transaction"
  `
  const typeById = new Map(types.map((item) => [item.id.toString(), item.type]))

  return NextResponse.json(
    transactions.map((transaction) =>
      serializeTransaction(
        transaction,
        typeById.get(transaction.id.toString()) === "deposit"
          ? "deposit"
          : "payment",
      ),
    ),
  )
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({error: "Request body must be an object"}, {status: 400})
    }

    const input = body as Record<string, unknown>
    const accountId = parseBigInt(input.account_id, "account_id")
    const date = parseDate(input.date)
    const type = parseTransactionType(input.type)
    const rawItems = input.items ?? []

    if (!Array.isArray(rawItems)) {
      return NextResponse.json({error: "items must be an array"}, {status: 400})
    }

    const items = rawItems.map((rawItem, index) => {
      if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
        throw new Error(`items[${index}] must be an object`)
      }

      const item = rawItem as Record<string, unknown>
      return {
        liability_id:
          item.liability_id === undefined ||
          item.liability_id === null ||
          item.liability_id === ""
            ? undefined
            : parseBigInt(item.liability_id, `items[${index}].liability_id`),
        payee_id:
          item.payee === undefined || item.payee === null || item.payee === ""
            ? undefined
            : parseBigInt(item.payee, `items[${index}].payee`),
        amount: parseAmount(item.amount),
        category: typeof item.category === "string" ? item.category : null,
        remark: typeof item.remark === "string" ? item.remark : null,
      }
    })

    const transaction = await prisma.transaction.create({
      data: {
        account_id: accountId,
        date,
        remark: typeof input.remark === "string" ? input.remark : null,
        transaction_item: {create: items},
      },
      include: transactionInclude,
    })
    await prisma.$executeRaw`
      UPDATE "public"."transaction" SET type = ${type} WHERE id = ${transaction.id}
    `

    return NextResponse.json(serializeTransaction(transaction, type), {status: 201})
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create transaction"
    return NextResponse.json({error: message}, {status: 400})
  }
}
