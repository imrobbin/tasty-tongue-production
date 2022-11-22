import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourOrdersPage } from './your-orders.page';

const routes: Routes = [
  {
    path: '',
    component: YourOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourOrdersPageRoutingModule {}
