import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationsPageComponent } from './applications-page.component';

import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [IonicModule, RouterModule.forChild([{ path: '', component: ApplicationsPageComponent }])],
  declarations: [ApplicationsPageComponent],
  exports: [ApplicationsPageComponent],
})
export class ApplicationsPageModule {}
