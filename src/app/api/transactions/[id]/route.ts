import {NextResponse} from "next/server"
import {prisma} from "@src/server/db"
import {parseBigInt, serializeTransaction} from "@src/server/db/transactions"

const transactionInclude = {transaction_item: true} as const

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_: Request, context: RouteContext) {
  try {
    const {id} = await context.params
    const transaction = await prisma.transaction.findUnique({
      where: {id: parseBigInt(id, "id")},
      include: transactionInclude,
    })

    if (!transaction) {
      return NextResponse.json({error: "Transaction not found"}, {status: 404})
    }
    const [{type}] = await prisma.$queryRaw<Array<{ type: string }>>`
      SELECT type FROM "public"."transaction" WHERE id = ${transaction.id}
    `

    return NextResponse.json(
      serializeTransaction(transaction, type === "deposit" ? "deposit" : "payment"),
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read transaction"
    return NextResponse.json({error: message}, {status: 400})
  }
}
