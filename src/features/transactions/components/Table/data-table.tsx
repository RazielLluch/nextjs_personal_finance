"use client"

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react"
import {
  useTable,
  type ColumnDef,
  type ExpandedState,
  type RowData,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/ui/table"

import { features, type DataTableFeatures } from "./table-features"
import EditableCell from "./editable-cell"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  getSubRows?: (row: TData) => TData[] | undefined
  onCellEdit?: (row: TData, columnId: string, value: unknown) => Promise<void> | void
  isCellEditable?: (row: TData, columnId: string) => boolean
  renderCellAction?: (row: TData, columnId: string) => ReactNode
  onTransactionCommit?: (row: TData) => void
}

export function DataTable<TData extends RowData>({
                                                   columns,
                                                   data,
                                                   getSubRows,
                                                   onCellEdit,
                                                   isCellEditable,
                                                   renderCellAction,
                                                   onTransactionCommit,
                                                 }: DataTableProps<TData>) {
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const table = useTable(
    {
      features,
      data,
      columns,
      getSubRows,
      state: { expanded },
      onExpandedChange: (updater) => {
        const next =
          typeof updater === "function" ? updater(expanded) : updater

        if (activeSplitId && expanded[activeSplitId] && !next[activeSplitId]) {
          const splitRow = table
            .getRowModel()
            .rows.find((row) => row.id === activeSplitId)
          if (splitRow) onTransactionCommit?.(splitRow.original)
          setActiveSplitId(null)
        }

        setExpanded(next)
      },
      autoResetExpanded: false,
    },
  )

  useEffect(() => {
    if (!activeSplitId) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      const groupId = target
        .closest<HTMLElement>("[data-transaction-group]")
        ?.dataset.transactionGroup

      if (groupId === activeSplitId) return

      const splitRow = table
        .getRowModel()
        .rows.find((row) => row.id === activeSplitId)
      if (splitRow) onTransactionCommit?.(splitRow.original)
      setActiveSplitId(null)
    }

    document.addEventListener("pointerdown", handlePointerDown, true)
    return () => document.removeEventListener("pointerdown", handlePointerDown, true)
  }, [activeSplitId, onTransactionCommit, table])

  return (
    <div ref={tableContainerRef} className="overflow-visible rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, rowIndex, rows) => {
              const nextRow = rows[rowIndex + 1]
              const parentRow =
                row.depth === 0
                  ? row
                  : rows
                      .slice(0, rowIndex)
                      .reverse()
                      .find((candidate) => candidate.depth === 0)
              const transactionGroup = parentRow?.id ?? row.id
              const isLastVisibleSubRow =
                row.depth > 0 && (!nextRow || nextRow.depth === 0)
              const actionParent = isLastVisibleSubRow ? parentRow : undefined

              return (
                <Fragment key={row.id}>
                  <TableRow
                    data-transaction-group={transactionGroup}
                    onPointerDown={() => {
                      if (parentRow?.original.subRows?.length) {
                        setActiveSplitId(parentRow.id)
                      }
                    }}
                    className={
                      row.depth > 0
                        ? "bg-accent/5"
                        : row.index % 2 === 0
                          ? "bg-background"
                          : "bg-muted/5"
                    }
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={isLastVisibleSubRow ? "relative overflow-visible" : undefined}
                      >
                        <EditableCell
                          value={cell.getValue()}
                          displayValue={<table.FlexRender cell={cell} />}
                          inputType={
                            cell.column.id === "date"
                              ? "date"
                              : cell.column.id === "payment" || cell.column.id === "deposit"
                                ? "number"
                                : "text"
                          }
                          disabled={
                            !onCellEdit ||
                            (isCellEditable ? !isCellEditable(row.original, cell.column.id) : false)
                          }
                          onSubmit={(value) =>
                            onCellEdit?.(row.original, cell.column.id, value)
                          }
                        />
                        {actionParent && cell.column.id !== "payment" && cell.column.id !== "deposit"
                          ? null
                          : actionParent
                            ? renderCellAction?.(actionParent.original, cell.column.id)
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}