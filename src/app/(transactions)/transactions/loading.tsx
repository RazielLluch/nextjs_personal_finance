import { Button } from "ui/button"
import { Skeleton } from "@src/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/ui/table"

const columns = ["date", "payee", "remark", "category", "payment", "deposit"]

export default function Loading() {
  return (
    <main className="container mx-auto space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-5 grow" />
          <Skeleton className="rounded-md border-2">
            Add Transaction
          </Skeleton>
        </div>
      </div>

      <div className="overflow-visible rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>
                  <Skeleton className="mx-auto h-4 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    <Skeleton className="h-4 w-full min-w-16" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
