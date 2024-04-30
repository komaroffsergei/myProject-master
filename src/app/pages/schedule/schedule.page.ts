import {Component, OnInit, ViewChild} from '@angular/core';
import {Column, GridOption} from "angular-slickgrid";

import {IonModal} from "@ionic/angular";
import {OverlayEventDetail} from '@ionic/core/components';
import {ScheduleDataView, TableRowCRUDMode, TableRowOpts} from "../../modules/table/services/base.table.service";
import {ScheduleTableService} from "./schedule-table.service";


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  gridColumns: Column[] = [];
  gridOptions: GridOption = {};
  gridData: any[] = [];
  @ViewChild('newModal') newModal: IonModal | any;
  @ViewChild('editModal') editModal: IonModal | any;

  protected newItem: ScheduleDataView = {
    id: 0,
    patient_fio: 'Иванов Иван',
    investigation_name: 'Investigation Name',
    status: 'Status',
    tape: 'Tape',
    bar_code: '000000',
    bcp_name: 'Bcp Name',
    completed: 'yep',
    deviation: 'Deviation',
    patient_id: 'Patient ID',
    date_direction: 'Date direction',
  }

  constructor(public tableService: ScheduleTableService) {

  }

  ngOnInit() {
    this.prepareGrid();
  }

  prepareGrid() {
    this.gridColumns = this.tableService.getTableColumns();
    this.gridOptions = this.tableService.getTableOptions();
    this.gridData = this.tableService.getTableData()
  }

  cancel() {
    this.newModal.dismiss(null, 'cancel');
  }

  confirm(item: ScheduleDataView | null, mode: TableRowCRUDMode) {
    if (!item) {
      return;
    }
    const opts: TableRowOpts = {
      item: item,
      mode: mode
    }
    if (mode === 'edit') {
      this.editModal.dismiss(opts, 'confirm');
    } else if (mode === 'delete') {

    } else if (mode === 'new') {
      this.newModal.dismiss(opts, 'confirm');
    }
  }

  onWillDismiss($event: Event) {
    const ev = $event as CustomEvent<OverlayEventDetail<TableRowOpts>>;
    if (ev.detail.data) {
      const mode: TableRowCRUDMode = ev.detail.data.mode;
      const item = ev.detail.data.item;
      if (ev.detail.role === 'confirm') {
        if (mode === 'new') {
          this.tableService.addItem({data: item, refresh: true});
        } else if (mode === 'edit') {
          this.tableService.updateItem({data: item, refresh: true});
        }
      }
    }
  }

  async deleteAlert() {
    await this.tableService.deleteAlert()
  }
}
