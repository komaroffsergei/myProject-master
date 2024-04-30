import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SamplesPageComponent } from './samples-page.component';

import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [IonicModule, RouterModule.forChild([{ path: '', component: SamplesPageComponent }])],
  declarations: [SamplesPageComponent],
  exports: [SamplesPageComponent],
})
export class ApplicationsPageModule {}
