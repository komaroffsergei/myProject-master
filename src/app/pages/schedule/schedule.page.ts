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

  protected newItem: ScheduleDataView = this.defaultItem();
  protected editItem: ScheduleDataView | null = null;
  protected formError = '';

  defaultItem(): ScheduleDataView {
    return {id:0,patient_fio:'Демонстрационный участник',investigation_name:'Общий анализ крови',
      status:'Запланировано',tape:'Пробирка EDTA',bar_code:'DEMO200001',bcp_name:'Демонстрационный пункт № 1',
      completed:false,deviation:'Нет',patient_id:'DEMO-NEW',date_direction:'2026-09-07T09:30:00Z'};
  }

  openNew() { this.newItem = this.defaultItem(); this.formError = ''; }
  async openEdit() {
    if (!this.tableService.selectedItem) return;
    this.editItem = {...this.tableService.selectedItem}; this.formError = '';
    await this.editModal.present();
  }
  isValid(item: ScheduleDataView | null): boolean {
    return !!item && ['patient_fio','investigation_name','status','patient_id'].every(key => {
      const value = String(item[key as keyof ScheduleDataView] || '').trim();
      return value.length > 0 && value.length <= 120;
    }) && Number.isFinite(Date.parse(item.date_direction));
  }

  constructor(public tableService: ScheduleTableService) {

  }

  ngOnInit() {
    this.prepareGrid();
  }

  ionViewDidEnter() {
    // Ionic finishes the route transition before the grid measures its viewport.
    this.tableService.angularGrid?.resizerService.resizeGrid();
  }

  prepareGrid() {
    this.gridColumns = this.tableService.getTableColumns();
    this.gridOptions = this.tableService.getTableOptions();
    this.gridData = this.tableService.getTableData()
  }

  cancel(mode: 'new'|'edit') { (mode === 'new' ? this.newModal : this.editModal).dismiss(null, 'cancel'); }

  confirm(item: ScheduleDataView | null, mode: TableRowCRUDMode) {
    if (!this.isValid(item)) { this.formError = 'Заполните обязательные поля и корректную дату.'; return; }
    if (!item) return;
    if (mode === 'new' && this.tableService.angularGrid.dataView.getLength() >= 500) { this.formError = 'В демо доступно до 500 записей. Сбросьте свой пример.'; return; }
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
