import { createFileRoute } from '@tanstack/react-router';
import { sampleRows } from '@/features/balance-reservation-journal/sample-data';
import { DataTable } from '@/features/table';
import { columns } from '@/features/balance-reservation-journal/columns';
import type { RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';
export const Route = createFileRoute('/_dashboard/balance-reservation-log')({
  component: RouteComponent,
});

// table with a sidebar that opens the details of the row

function RouteComponent() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  console.log('Row selection:', rowSelection);
  return (
    // <div className="flex flex-col gap-4 overflow-y-auto p-4">
    <div className="flex max-h-full flex-1 flex-nowrap gap-2 overflow-x-auto">
      {/* <h1>Hello "/_dashboard/balance-reservation-log"!</h1> */}

      <DataTable
        columns={columns}
        data={sampleRows}
        className={
          Object.keys(rowSelection).length > 0
            ? 'w-1/6 min-w-60 flex-auto'
            : 'flex-auto'
        }
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection} // Initialize with an empty object
      />

      {Object.keys(rowSelection).length > 0 && (
        <div className="h-50 min-w-80 flex-1 bg-orange-300">
          selected rows: {Object.keys(rowSelection)[0]}
        </div>
      )}
    </div>
    // </div>
  );
}
