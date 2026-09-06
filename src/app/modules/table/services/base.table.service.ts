import {TableServiceInterface} from "../../../interfaces/tableServiceInterface";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {AlertController} from "@ionic/angular";
import {
  AngularGridInstance,
  Column,
  FieldType,
  Filters,
  Formatter,
  GridOption,
  GridStateChange,
  Metrics
} from "angular-slickgrid";


export type TableRowCRUDMode = 'new' | 'edit' | 'delete';
export type TableRowOpts = {
  item: ScheduleDataView,
  mode: TableRowCRUDMode
}

export interface ScheduleDataView {
  id: number;
  investigation_name: string;
  status: string;
  tape: string,
  deviation: string;
  bar_code: string;
  bcp_name: string;
  date_direction: string;
  completed: boolean;
  patient_id: string;
  patient_fio: string;
}

const NB_ITEMS = 180;

export class BaseTableService implements TableServiceInterface {
  constructor(protected  http: HttpClient, protected  translate: TranslateService, protected  alertController: AlertController) {
  }

  get selectedItem(): ScheduleDataView | null {
    return this._selectedItem;
  }

  angularGrid!: AngularGridInstance;
  metrics!: Metrics;

  getTableColumns(): Column<ScheduleDataView>[] {
    return [
    ];
  }

  toggleCompletedProperty(item: any) {
    // toggle property
    if (typeof item === 'object') {
      item.completed = !item.completed;

      // simulate a backend http call and refresh the grid row after delay
      setTimeout(() => {
        this.angularGrid.gridService.updateItemById(item.id, item, {highlightRow: false});
      }, 250);
    }
  }

  getTableOptions(): GridOption {
    return {
      // row selections
      enableAutoResize: true,
      enableCellNavigation: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
      autoResize: {
        container: '#table-container',
        rightPadding: 10
      },
      // enableExcelExport: true,
      // enableExcelCopyBuffer: true,
      enableFiltering: true,
      // enableFilterTrimWhiteSpace: true,
      i18n: this.translate,
      showCustomFooter: true, // display some metrics in the bottom custom footer

    };
  }

  private _dataset: ScheduleDataView[] = [];

  private initialized = false;
  getTableData(): ScheduleDataView[] {
    if (!this.initialized) { this._dataset = this.mockData(NB_ITEMS); this.initialized = true; }
    return this._dataset;
  }

  mockData(itemCount: number, startingIndex = 0): ScheduleDataView[] {
    return Array.from({length:itemCount}, (_, n) => {
      const i = startingIndex+n;
      return {id:i+1, patient_id:`DEMO-${String(i+1).padStart(4,'0')}`,
        patient_fio:`Демонстрационный участник ${i+1}`,
        investigation_name:['Общий анализ крови','Биохимический профиль','Анализ образца'][i%3],
        status:['Запланировано','Образец получен','В обработке','Завершено'][i%4],
        tape:['Пробирка EDTA','Пробирка с гелем','Контейнер'][i%3],
        deviation:i%7===0?'Требуется проверка':'Нет', bar_code:`DEMO${String(100000+i)}`,
        bcp_name:`Демонстрационный пункт № ${i%4+1}`,
        date_direction:`2026-09-${String(7+i%7).padStart(2,'0')}T${String(8+i%10).padStart(2,'0')}:30:00Z`,
        completed:i%4===3};
    });
  }

  private _selectedItem: ScheduleDataView | null = null;

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
  }

  onSelectedRowsChanged($event: any) {
    const rows = $event.detail.args.rows;
    this._selectedItem = rows.length ? this.angularGrid.gridService.getDataItemByRowNumber(rows[0]) : null;
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridState: GridStateChange) {
    console.log('Client sample, Grid State changed:: ', gridState);
  }

  /** Save current Filters, Sorters in LocaleStorage or DB */
  saveCurrentGridState() {
    console.log('Client sample, last Grid State:: ', this.angularGrid.gridStateService.getCurrentGridState());
  }

  async deleteAlert() {
    const item: ScheduleDataView | null = this.selectedItem;
    if (item) {
      const alert = await this.alertController.create({
        header: 'Удалить демонстрационную запись?',
        subHeader: item.patient_id,
        message: 'Изменение затронет только вашу вкладку. Сброс восстановит исходный набор.',
        buttons: [{
          text: 'Отмена',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
          {
            text: 'Удалить',
            role: 'confirm',
            handler: () => {
              if (this.selectedItem) {
                this.deleteItem({data: this.selectedItem, refresh: true})
              }
            },
          },],
      });

      await alert.present();
    }
  }

  // setFiltersDynamically() {
  //   // we can Set Filters Dynamically (or different filters) afterward through the FilterService
  //   this.angularGrid.filterService.updateFilters([
  //     {columnId: 'duration', searchTerms: [2, 25, 48, 50]},
  //     {columnId: 'complete', searchTerms: [95], operator: '<'},
  //     {columnId: 'effort-driven', searchTerms: [true]},
  //     {columnId: 'start', operator: '>=', searchTerms: ['2001-02-28']},
  //   ]);
  // }
  //
  // setSortingDynamically() {
  //   this.angularGrid.sortService.updateSorting([
  //     // orders matter, whichever is first in array will be the first sorted column
  //     {columnId: 'duration', direction: 'ASC'},
  //     {columnId: 'start', direction: 'DESC'},
  //   ]);
  // }

  refreshMetrics(e: Event, args: any) {
    if (args && args.current >= 0) {
      setTimeout(() => {
        this.metrics = {
          startTime: new Date(),
          endTime: new Date(),
          itemCount: args && args.current || 0,
          totalItemCount: this.angularGrid.dataView.getLength()
        };
      });
    }
  }

  addItem(opts: { data: ScheduleDataView, refresh: boolean }) {
    const item: ScheduleDataView = {...opts.data};
    item.id = Math.max(0, ...this.angularGrid.dataView.getItems().map((row: ScheduleDataView) => row.id)) + 1;
    const rowNumber = this.angularGrid.gridService.addItem(item);
    this.angularGrid.gridService.renderGrid();
    if (rowNumber !== undefined) {
      this.angularGrid.gridService.highlightRow(rowNumber, 2000);
      this.angularGrid.gridService.setSelectedRow(rowNumber);
    }
  }

  updateItem(opts: { data: ScheduleDataView, refresh: boolean }) {
    const item: ScheduleDataView = {...opts.data};
    const rowNumber = this.angularGrid.gridService.updateItem(item);
    if (opts.refresh) {
      this.angularGrid.gridService.renderGrid();
      if (rowNumber !== undefined) {
        this.angularGrid.gridService.highlightRow(rowNumber, 2000);
        // this.angularGrid.gridService.setSelectedRow(rowNumber);
      }
    }
  }

  deleteItem(opts: { data: ScheduleDataView, refresh: boolean }) {
    this.angularGrid.gridService.deleteItem(opts.data);
    this._selectedItem = null;
    if (opts.refresh) {
      this.angularGrid.gridService.renderGrid();
    }
  }
}
