import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {BCPPageRoutingModule} from './bcp-routing.module';
import {BcpPage} from "./bcp.page";


@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, BCPPageRoutingModule], declarations: [BcpPage]
})
export class BCPPageModule {
}
