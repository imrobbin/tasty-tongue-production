import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodOrdersPageRoutingModule } from './food-orders-routing.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { FoodOrdersPage } from './food-orders.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FoodOrdersPageRoutingModule,
        SharedComponentsModule,
    ],
    declarations: [FoodOrdersPage],
})
export class FoodOrdersPageModule {}
