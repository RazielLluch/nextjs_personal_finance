import {NextResponse} from "next/server"
import {prisma} from "@src/server/db"
import {
  parseAmount,
  parseBigInt,
} from "@src/server/db/transactions"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  try {
    const {id} = await context.params
    const transactionId = parseBigInt(id, "id")
    const body: unknown = await request.json()

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({error: "Request body must be an object"}, {status: 400})
    }

    const item = body as Record<string, unknown>
    const createdItem = await prisma.transaction_item.create({
      data: {
        transaction_id: transactionId,
        liability_id:
          item.liability_id === undefined ||
          item.liability_id === null ||
          item.liability_id === ""
            ? undefined
            : parseBigInt(item.liability_id, "liability_id"),
        payee_id:
          item.payee === undefined || item.payee === null || item.payee === ""
            ? undefined
            : parseBigInt(item.payee, "payee"),
        amount: parseAmount(item.amount),
        category: typeof item.category === "string" ? item.category : null,
        remark: typeof item.remark === "string" ? item.remark : null,
      },
    })

    return NextResponse.json(
      {
        id: Number(createdItem.id),
        ...(createdItem.liability_id !== null
          ? {liability_id: Number(createdItem.liability_id)}
          : {}),
        amount: createdItem.amount,
        category: createdItem.category ?? "",
        payee: Number(createdItem.payee_id ?? 0),
        remark: createdItem.remark ?? "",
        created_at: createdItem.created_at,
        ...(createdItem.updated_at
          ? {updated_at: createdItem.updated_at}
          : {}),
      },
      {status: 201},
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create sub-transaction"
    return NextResponse.json({error: message}, {status: 400})
  }
}
