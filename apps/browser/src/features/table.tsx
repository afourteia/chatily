import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowAnim,
} from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import type { CustomTableMeta } from '@/utils/tanstack-table';

// * Issue: https://github.com/TanStack/table/issues/4382
// interface DataTableProps<TData, TValue> {
// columns: ColumnDef<TData, TValue>[];
interface DataTableProps<TData, TValue> {
  columns: {
    [K in keyof Required<TData>]: ColumnDef<TData, TData[K]>;
  }[keyof TData][];
  tableMeta?: CustomTableMeta<TData>;
  data: TData[];
  className?: string;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  showFooter?: boolean; // Optional prop to control footer visibility
}

type TableRowData = {
  id: string;
  [key: string]: unknown; // Adjust this type based on your actual row data structure
};

export function DataTable<TData extends TableRowData, TValue>({
  columns,
  data,
  className,
  onRowSelectionChange,
  rowSelection,
  showFooter = false, // Default to true if not provided
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    enableMultiRowSelection: false,
    onRowSelectionChange: onRowSelectionChange, //hoist up the row selection state to your own scope

    getCoreRowModel: getCoreRowModel(),
    // getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableSorting: true,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      // TypeError: rowSelections can't be undefined
      rowSelection: rowSelection ?? {},
    },
    debugTable: true,
  });

  return (
    <div
      id="employee-compensation-table"
      className={cn(
        `relative min-h-9 flex-auto overflow-y-auto overscroll-auto rounded-md
        border`,
        className,
      )}
    >
      <Table className="border-collapse">
        <TableHeader className="sticky start-0 top-[-2px] z-10 bg-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="divide-x-2"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header, index) => {
                // last item in the header group
                const isLastIndex = headerGroup.headers.length - 1 === index;
                return (
                  <TableHead
                    key={header.id}
                    className="p-0 text-center"
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {header.column.getCanSort() ? (
                          // TODO: need to investigate the border issue with header element
                          <div
                            className="flex h-full cursor-pointer select-none
                              items-center justify-center border-e-2
                              data-[state=last]:border-e-0"
                            data-state={isLastIndex ? 'last' : 'not-last'}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRowAnim
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : false}
                onClick={row.getToggleSelectedHandler()}
                className="cursor-pointer text-start even:bg-secondary/75"
                // {() => {
                //   if (!row.getIsSelected()) row.toggleSelected();
                // }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRowAnim>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                لا توجد معلومات لعرضها
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {showFooter && (
          <TableFooter
            className="sticky bottom-[-5px] start-0 z-10 bg-secondary"
          >
            {table.getFooterGroups().map((footerGroup) => (
              // footerGroup.depth === 0 ? null : (
              <TableRow
                className="border-0"
                key={footerGroup.id}
              >
                {footerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // className={cn('text-center', bgColor)}
                      colSpan={
                        header.colSpan
                        // (header.column.columnDef.meta as any)?.footerSpan
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
