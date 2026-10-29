"use client"

import {columns} from "./columns"
import {DataTable} from "./data-table"
import type {TransactionTableRow} from "../../types"
import type { ReactNode } from "react"

type TransactionsDataTableProps = {
  data: TransactionTableRow[]
  onCellEdit?: (
    row: TransactionTableRow,
    columnId: string,
    value: unknown,
  ) => Promise<void> | void
  renderCellAction?: (row: TransactionTableRow, columnId: string) => ReactNode
  onTransactionCommit?: (row: TransactionTableRow) => void
}

export function TransactionsDataTable({
                                        data,
                                        onCellEdit,
                                        renderCellAction,
                                        onTransactionCommit,
                                      }: TransactionsDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getSubRows={(row) => row.subRows}
      onCellEdit={onCellEdit}
      isCellEditable={(row, columnId) => {
        if (row.subRows?.length) {
          return columnId !== "category" && columnId !== "payee"
        }

        return columnId !== "date"
      }}
      renderCellAction={renderCellAction}
      onTransactionCommit={onTransactionCommit}
    />
  )
}
