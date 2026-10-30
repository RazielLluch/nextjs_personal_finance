export type Transaction = {
  id: number
  remark: string
  date: Date
  type: "payment" | "deposit"
  items: TransactionItem[]
}

export type TransactionItem = {
  id: number
  liability_id?: number
  amount: number
  category: string
  payee: number
  remark: string
}

export type TransactionTableRow = {
  id: string
  date: Date
  payee: string
  remark: string
  category: string
  payment: number
  deposit: number
  subRows?: TransactionTableRow[]
}

export function toTransactionTableRows(
  transactions: Transaction[],
): TransactionTableRow[] {
  return transactions.map((transaction) => {
    const subRows = transaction.items.map((item) => ({
      id: `item-${item.id}`,
      date: transaction.date,
      payee: String(item.payee),
      remark: item.remark,
      category: item.category,
      payment: transaction.type === "payment" ? item.amount : 0,
      deposit: transaction.type === "deposit" ? item.amount : 0,
    }))

    return {
      id: `transaction-${transaction.id}`,
      date: transaction.date,
      payee: getSplitPayee(subRows),
      remark: transaction.remark,
      category: subRows.length === 1 ? subRows[0].category : "Split transaction",
      payment:
        transaction.type === "payment"
          ? subRows.reduce((total, item) => total + item.payment, 0)
          : 0,
      deposit:
        transaction.type === "deposit"
          ? subRows.reduce((total, item) => total + item.deposit, 0)
          : 0,
      subRows: subRows.length > 1 ? subRows : undefined,
    }
  })
}

function getSplitPayee(subRows: TransactionTableRow[]) {
  const payees = [...new Set(
    subRows
      .map((row) => row.payee.trim())
      .filter(Boolean),
  )]

  if (payees.length === 0) return ""
  if (payees.length === 1) return payees[0]
  return "multiple"
}