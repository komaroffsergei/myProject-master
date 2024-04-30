import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableComponent} from "./table.component";


import {AngularSlickgridModule} from "angular-slickgrid"; // Column Definition Type Interface

@NgModule({
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent
  ],
  imports: [
    CommonModule,
    AngularSlickgridModule
  ]
})
export class TableModule {
}
