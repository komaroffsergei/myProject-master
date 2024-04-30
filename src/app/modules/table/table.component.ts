import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Column, GridOption} from "angular-slickgrid"; // Column Definition Type Interface
@Component({
  selector: 'app-table',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './table.component.html',
  styleUrls: [
    './table.component.scss',
  ],
})
export class TableComponent {
  @Input() columns: Column[] = [];
  @Input() options: GridOption = {};
  @Input() data: any[] = [];
  @Output() onRowCountChanged = new EventEmitter<any>();
  @Output() onBeforeGridDestroy = new EventEmitter<any>();
  @Output() onAngularGridCreated = new EventEmitter<any>();
  @Output() onGridStateChanged = new EventEmitter<any>();
  @Output() onSelectedRowsChanged: EventEmitter<any> = new EventEmitter<any>();

  angularGridCreated($event: any) {
    this.onAngularGridCreated.emit($event);
  }


  gridStateChanged($event: any) {
    this.onGridStateChanged.emit($event);
  }


  beforeGridDestroy() {
    this.onBeforeGridDestroy.emit();
  }


  rowCountChanged($event: any) {
    this.onRowCountChanged.emit($event);
  }

  selectedRowsChanged($event: any) {
    this.onSelectedRowsChanged.emit($event);
  }
}
