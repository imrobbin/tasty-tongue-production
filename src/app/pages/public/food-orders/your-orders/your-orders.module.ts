import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourOrdersPageRoutingModule } from './your-orders-routing.module';

import { YourOrdersPage } from './your-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourOrdersPageRoutingModule
  ],
  declarations: [YourOrdersPage]
})
export class YourOrdersPageModule {}
