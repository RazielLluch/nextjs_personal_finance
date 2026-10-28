"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { TransactionTableRow } from "../../types"

type TransactionsDataTableProps = {
  data: TransactionTableRow[]
}

export function TransactionsDataTable({
  data,
}: TransactionsDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getSubRows={(row) => row.subRows}
    />
  )
}
