import { type RowData } from '@tanstack/react-table';

export type CustomTableMeta<TData extends RowData> = {};

declare module '@tanstack/react-table' {
  // interface ColumnMeta<TData extends RowData, TValue> {
  //   // metaFooColumn: string;
  // }

  interface TableMeta<TData extends RowData> extends CustomTableMeta<TData> {}
}
