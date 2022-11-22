import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TastyTonguePageRoutingModule } from './tasty-tongue-routing.module';
import { TastyTonguePage } from './tasty-tongue.page';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TastyTonguePageRoutingModule,
        SharedComponentsModule,
    ],
    declarations: [TastyTonguePage],
})
export class TastyTonguePageModule {}
