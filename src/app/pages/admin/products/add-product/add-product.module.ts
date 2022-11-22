import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductPageRoutingModule } from './add-product-routing.module';
import { AddProductPage } from './add-product.page';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        AddProductPageRoutingModule,
        SharedComponentsModule,
    ],
    declarations: [AddProductPage],
})
export class AddProductPageModule {}
