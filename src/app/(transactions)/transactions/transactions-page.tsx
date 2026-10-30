"use client"

import { useTransactions } from "@src/features/transactions/hooks"
import { TransactionsDataTable } from "@src/features/transactions/components/Table/transactions-data-table"
import type { TransactionTableRow } from "@src/features/transactions/types"
import { Button } from "ui/button"

export function TransactionsPage({
  initialData,
}: {
  initialData: TransactionTableRow[]
}) {
  const {
    data,
    unbalancedSplit,
    updateRow,
    distributeSplit,
    addSplit,
  } = useTransactions(initialData)

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="flex gap-2">
          <p className="grow text-muted-foreground">
            Review your transactions and their split sub-transactions.
          </p>
          <Button className="rounded-md border-2">Add Transaction</Button>
        </div>
      </div>

      <TransactionsDataTable
        data={data}
        onCellEdit={updateRow}
        onTransactionCommit={(transaction) => {
          void transaction
        }}
        renderCellAction={(row, columnId) =>
          unbalancedSplit?.parentId === row.id &&
          unbalancedSplit.editedColumn === columnId ? (
            <div className="absolute left-1/2 top-full z-30 mt-3 w-56 -translate-x-1/3 rounded-xl border-2 border-foreground bg-background p-3 text-center text-xs shadow-lg">
              <span className="absolute -top-3 left-[68%] h-5 w-5 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-foreground bg-background" />
              <span className="absolute -top-2 left-[68%] h-3 w-3 -translate-x-1/2 rotate-45 bg-background" />
              <p className="font-medium">Split transaction is not balanced.</p>
              <div className="mt-2 flex justify-center gap-2">
                <button
                  type="button"
                  className="rounded border px-2 py-1"
                  onClick={distributeSplit}
                >
                  Distribute
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-1"
                  onClick={addSplit}
                >
                  Add split
                </button>
              </div>
            </div>
          ) : null
        }
      />
    </main>
  )
}
