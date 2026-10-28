"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./table-features"
import { type TransactionTableRow } from "../../types"

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, TransactionTableRow>()

export const columns = columnHelper.columns([
  columnHelper.accessor("date", {
    header: "date",
  }),
  columnHelper.accessor("payee", {
    header: "payee",
  }),
  columnHelper.accessor("remark", {
    header: "remark",
  }),
  columnHelper.accessor("category", {
    header: "category",
    cell: ({ getValue, row }) => {
      const category = getValue()

      if (!row.getCanExpand()) {
        return category
      }

      return (
        <button
          type="button"
          className="rounded-md bg-muted/20 px-2 py-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          aria-label={row.getIsExpanded() ? "Collapse split transaction" : "Expand split transaction"}
          aria-expanded={row.getIsExpanded()}
          onClick={row.getToggleExpandedHandler()}
        >
          {category}
        </button>
      )
    },
  }),
  columnHelper.accessor("payment", {
    header: "payment",
  }),
  columnHelper.accessor("deposit", {
    header: "deposit",
  }),
])