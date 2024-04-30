import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BcpPage } from './bcp.page';

const routes: Routes = [
  {
    path: '',
    component: BcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BCPPageRoutingModule {}
