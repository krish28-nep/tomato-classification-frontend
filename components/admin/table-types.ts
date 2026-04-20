export type AdminTableColumn<TData> = {
  key: keyof TData | string
  header: string
  cell: (row: TData, index: number) => React.ReactNode
}
