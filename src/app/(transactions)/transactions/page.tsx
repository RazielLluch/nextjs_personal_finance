import { TransactionsDataTable } from "@src/features/transactions/components/Table/transactions-data-table"
import { transactions } from "@src/features/transactions/TempData"
import { toTransactionTableRows } from "@src/features/transactions/types"

export default function TransactionsPage() {
  const data = toTransactionTableRows(transactions)

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-muted-foreground">
          Review your transactions and their split sub-transactions.
        </p>
      </div>

      <TransactionsDataTable data={data} />
    </main>
  )
}