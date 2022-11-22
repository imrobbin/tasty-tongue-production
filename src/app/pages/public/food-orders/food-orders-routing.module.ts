import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodOrdersPage } from './food-orders.page';

const routes: Routes = [
  {
    path: '',
    component: FoodOrdersPage
  },
  {
    path: 'your-orders',
    loadChildren: () => import('./your-orders/your-orders.module').then( m => m.YourOrdersPageModule)
  },
  {
    path: 'address-book',
    loadChildren: () => import('./address-book/address-book.module').then( m => m.AddressBookPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodOrdersPageRoutingModule {}
