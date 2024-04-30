import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';
import {TableModule} from "../../modules/table/table.module";
import {ScheduleTableService} from "./schedule-table.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    TableModule
  ],
  declarations: [SchedulePage],
  providers: [
    ScheduleTableService
  ]
})
export class SchedulePageModule {}
