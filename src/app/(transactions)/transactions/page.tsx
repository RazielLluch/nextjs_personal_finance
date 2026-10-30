"use client"

import {useEffect, useState} from "react"
import {TransactionsDataTable} from "@src/features/transactions/components/Table/transactions-data-table"
import {
  toTransactionTableRows,
  type Transaction,
  type TransactionTableRow,
} from "@src/features/transactions/types"

type SplitEdit = {
  parentId: string
  editedColumn: "payment" | "deposit"
}

const getAmount = (row: TransactionTableRow) => row.payment || row.deposit

const getSplitPayee = (subRows: TransactionTableRow[]) => {
  const payees = [...new Set(
    subRows
      .map((child) => child.payee.trim())
      .filter(Boolean),
  )]

  if (payees.length === 0) return ""
  if (payees.length === 1) return payees[0]
  return "multiple"
}

export default function TransactionsPage() {
  const [data, setData] = useState<TransactionTableRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unbalancedSplit, setUnbalancedSplit] = useState<SplitEdit | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        if (!response.ok) {
          throw new Error("Unable to load transactions")
        }

        const payload = (await response.json()) as Array<
          Omit<Transaction, "date" | "created_at" | "updated_at" | "items"> & {
            date: string
            created_at: string
            updated_at?: string
            items: Array<
              Omit<Transaction["items"][number], "created_at" | "updated_at"> & {
                created_at: string
                updated_at?: string
              }
            >
          }
        >
        const transactions: Transaction[] = payload.map((transaction) => {
          const {updated_at: transactionUpdatedAt, ...transactionFields} = transaction

          return {
            ...transactionFields,
            date: new Date(transaction.date),
            created_at: new Date(transaction.created_at),
            ...(transactionUpdatedAt
              ? {updated_at: new Date(transactionUpdatedAt)}
              : {}),
            items: transaction.items.map((item) => {
              const {updated_at: itemUpdatedAt, ...itemFields} = item

              return {
                ...itemFields,
                created_at: new Date(item.created_at),
                ...(itemUpdatedAt
                  ? {updated_at: new Date(itemUpdatedAt)}
                  : {}),
              }
            }),
          }
        })

        if (isMounted) {
          setData(toTransactionTableRows(transactions))
          setError(null)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load transactions")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTransactions()
    return () => {
      isMounted = false
    }
  }, [])

  const updateRow = (
    row: TransactionTableRow,
    columnId: string,
    value: unknown,
  ) => {
    if (columnId !== "payment" && columnId !== "deposit") {
      setData(
        data.map((parent) => {
          if (parent.id === row.id) {
            const updatedParent = { ...parent, [columnId]: value }

            if (columnId === "date" && parent.subRows) {
              updatedParent.subRows = parent.subRows.map((child) => ({
                ...child,
                date: value as Date,
              }))
            }

            return updatedParent
          }

          if (!parent.subRows?.some((child) => child.id === row.id)) {
            return parent
          }

          const subRows = parent.subRows.map((child) =>
            child.id === row.id ? { ...child, [columnId]: value } : child,
          )

          return {
            ...parent,
            payee: columnId === "payee" ? getSplitPayee(subRows) : parent.payee,
            subRows,
          }
        }),
      )
      return
    }

    const editedAmount = Number(value)
    const editedColumn = columnId as "payment" | "deposit"
    const oppositeColumn = editedColumn === "payment" ? "deposit" : "payment"

    const nextData = data.map((parent) => {
      if (parent.id === row.id) {
        if (!parent.subRows?.length) {
          return {
            ...parent,
            [editedColumn]: editedAmount,
            [oppositeColumn]: 0,
          }
        }

        const subRows = parent.subRows.map((child) => ({
          ...child,
          [editedColumn]: getAmount(child),
          [oppositeColumn]: 0,
        }))

        return {
          ...parent,
          [editedColumn]: editedAmount,
          [oppositeColumn]: 0,
          subRows,
        }
      }

      const editedSubRow = parent.subRows?.find((child) => child.id === row.id)
      if (!editedSubRow || !parent.subRows) {
        return parent
      }

      const subRows = parent.subRows.map((child) =>
        child.id === row.id
          ? {...child, [editedColumn]: editedAmount, [oppositeColumn]: 0}
          : child,
      )
      return {...parent, subRows}
    })

    setData(nextData)
    const editedParent = nextData.find((parent) =>
      parent.subRows?.some((child) => child.id === row.id),
    )
    if (editedParent) {
      const target =
        editedColumn === "payment" ? editedParent.payment : editedParent.deposit
      const splitAmount = editedParent.subRows?.reduce(
        (total, child) => total + getAmount(child),
        0,
      ) ?? 0
      setUnbalancedSplit(
        splitAmount === target
          ? null
          : {parentId: editedParent.id, editedColumn},
      )
    } else {
      setUnbalancedSplit(null)
    }
  }

  const distributeSplit = () => {
    if (!unbalancedSplit) return

    const nextData = data.map((parent) => {
      if (parent.id !== unbalancedSplit.parentId || !parent.subRows) {
        return parent
      }

      const target = getAmount(parent)
      const populated = parent.subRows.reduce(
        (total, child) => total + getAmount(child),
        0,
      )
      const blankRows = parent.subRows.filter((child) => getAmount(child) === 0)
      const remainingInCents = Math.round((target - populated) * 100)

      if (blankRows.length === 0 || remainingInCents <= 0) {
        return parent
      }

      const amountPerRow = Math.floor(remainingInCents / blankRows.length)
      let remainder = remainingInCents % blankRows.length
      const subRows = parent.subRows.map((child) => {
        if (getAmount(child) !== 0) return child
        const amountInCents = amountPerRow + (remainder-- > 0 ? 1 : 0)
        const amount = amountInCents / 100
        return unbalancedSplit.editedColumn === "payment"
          ? { ...child, payment: amount, deposit: 0 }
          : { ...child, payment: 0, deposit: amount }
      })

      return {...parent, subRows}
    })
    setData(nextData)

    const parent = nextData.find((row) => row.id === unbalancedSplit.parentId)
    const target = parent ? getAmount(parent) : 0
    const total = parent?.subRows?.reduce(
      (sum, child) => sum + getAmount(child),
      0,
    ) ?? 0
    if (total === target) setUnbalancedSplit(null)
  }

  const addSplit = () => {
    if (!unbalancedSplit) return

    const nextData = data.map((parent) => {
      if (parent.id !== unbalancedSplit.parentId || !parent.subRows) {
        return parent
      }

      return {
        ...parent,
        subRows: [
          ...parent.subRows,
          {
            id: `new-item-${Date.now()}`,
            date: parent.date,
            payee: "",
            remark: "",
            category: "",
            payment: 0,
            deposit: 0,
          },
        ],
      }
    })
    setData(nextData)
  }

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-muted-foreground">
          Review your transactions and their split sub-transactions.
        </p>
      </div>

      {isLoading ? <p>Loading transactions...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!isLoading && !error ? (
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
      ) : null}
    </main>
  )
}