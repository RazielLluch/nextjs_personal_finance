import {useState} from "react"
import {
  type TransactionTableRow,
} from "@src/features/transactions/types"

export type SplitEdit = {
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

export function useTransactions(initialData: TransactionTableRow[]) {
  const [data, setData] = useState<TransactionTableRow[]>(initialData)
  const [unbalancedSplit, setUnbalancedSplit] = useState<SplitEdit | null>(null)

  const updateRow = (
    row: TransactionTableRow,
    columnId: string,
    value: unknown,
  ) => {
    if (columnId !== "payment" && columnId !== "deposit") {
      setData(
        data.map((parent) => {
          if (parent.id === row.id) {
            const updatedParent = {...parent, [columnId]: value}

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
            child.id === row.id ? {...child, [columnId]: value} : child,
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
          ? {...child, payment: amount, deposit: 0}
          : {...child, payment: 0, deposit: amount}
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

  return {
    data,
    unbalancedSplit,
    updateRow,
    distributeSplit,
    addSplit,
  }
}
