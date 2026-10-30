import type {transaction} from "@src/server/generated/prisma/client.js"
import type {Transaction} from "@src/features/transactions/types"

type TransactionWithItems = transaction & {
  transaction_item?: Array<{
    id: bigint
    liability_id: bigint | null
    payee_id: bigint | null
    remark: string | null
    category: string | null
    amount: number
    created_at: Date
    updated_at: Date | null
  }>
}

export function serializeTransaction(
  record: TransactionWithItems,
  type: Transaction["type"] = "payment",
): Transaction {
  return {
    id: Number(record.id),
    remark: record.remark ?? "",
    date: record.date,
    type,
    items: (record.transaction_item ?? []).map((item) => ({
      id: Number(item.id),
      ...(item.liability_id !== null
        ? {liability_id: Number(item.liability_id)}
        : {}),
      amount: item.amount,
      category: item.category ?? "",
      payee: Number(item.payee_id ?? 0),
      remark: item.remark ?? "",
    })),
  }
}

export function parseBigInt(value: unknown, field: string): bigint {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "number" && !Number.isInteger(value))
  ) {
    throw new Error(`${field} must be an integer`)
  }

  try {
    return BigInt(value)
  } catch {
    throw new Error(`${field} must be an integer`)
  }
}

export function parseDate(value: unknown): Date {
  if (typeof value !== "string" && !(value instanceof Date)) {
    throw new Error("date must be an ISO date string")
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error("date must be a valid ISO date string")
  }

  return date
}

export function parseAmount(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error("amount must be a finite number greater than or equal to 0")
  }

  return value
}

export function parseTransactionType(value: unknown): Transaction["type"] {
  if (value !== "payment" && value !== "deposit") {
    throw new Error('type must be either "payment" or "deposit"')
  }

  return value
}
