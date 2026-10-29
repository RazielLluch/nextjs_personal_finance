 "use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./table-features"
import { type TransactionTableRow } from "../../types"
import {
  DateCellRenderer,
  CategoryRenderer,
  AmountCellRenderer
} from "@src/features/transactions/components/Table/cells";

const columnHelper = createColumnHelper<DataTableFeatures, TransactionTableRow>()

const HeaderCell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center items-center w-full">
    {children}
  </div>
)

export const columns = columnHelper.columns([
  columnHelper.accessor("date", {
    header: () => <HeaderCell>date</HeaderCell>,
    cell: ({ getValue }) => <DateCellRenderer date={getValue()} />,
    meta: {
      style: { textAlign: 'center', maxWidth: '100px' },
    }
  }),
  columnHelper.accessor("payee", {
    header: () => <HeaderCell>payee</HeaderCell>,
    meta: {
      style: { textAlign: 'center', maxWidth: '150px' },
    }
  }),
  columnHelper.accessor("remark", {
    header: () => <HeaderCell>remark</HeaderCell>,
    meta: {
      style: { textAlign: 'center', maxWidth: '200px' },
    }
  }),
  columnHelper.accessor("category", {
    header: () => <HeaderCell>category</HeaderCell>,
    cell: ({ getValue, row }) => <CategoryRenderer category={getValue()} row={row}/>,
    meta: {
      style: { textAlign: 'center', maxWidth: '150px' },
    }
  }),
  columnHelper.accessor("payment", {
    header: () => <HeaderCell>payment</HeaderCell>,
    cell: ({ getValue }) => <AmountCellRenderer amount={getValue()} />,
    meta: {
      style: { textAlign: 'center', maxWidth: '150px' },
    }
  }),
  columnHelper.accessor("deposit", {
    header: () => <HeaderCell>deposit</HeaderCell>,
    cell: ({ getValue }) => <AmountCellRenderer amount={getValue()} />,
    meta: {
      style: { textAlign: 'center', maxWidth: '150px' },
    }
  }),
])