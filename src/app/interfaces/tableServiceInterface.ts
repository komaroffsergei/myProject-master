import {Column, GridOption} from "angular-slickgrid";

export interface TableServiceInterface {
  getTableColumns(): Column[];
  getTableOptions(): GridOption
  getTableData(): any[]
}
