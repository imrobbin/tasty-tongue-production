import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TastyTonguePage } from './tasty-tongue.page';

import { AdminGuard } from 'src/app/guards/admin.guard';
import { UserGuard } from 'src/app/guards/user.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'orders',
    },
    {
        path: '',
        component: TastyTonguePage,
        children: [
            {
                path: 'products',
                canActivate: [AdminGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../admin/products/products.module').then(
                                (m) => m.ProductsPageModule
                            ),
                    },
                    {
                        path: 'add-product',
                        loadChildren: () =>
                            import(
                                '../admin/products/add-product/add-product.module'
                            ).then((m) => m.AddProductPageModule),
                    },
                    {
                        path: 'add-product/:productId',
                        loadChildren: () =>
                            import(
                                '../admin/products/add-product/add-product.module'
                            ).then((m) => m.AddProductPageModule),
                    },
                ],
            },
            {
                path: 'orders',
                canActivate: [AdminGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../admin/orders/orders.module').then(
                                (m) => m.OrdersPageModule
                            ),
                    },
                ],
            },
            {
                path: 'menu',
                canActivate: [UserGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../public/menu/menu.module').then(
                                (m) => m.MenuPageModule
                            ),
                    },
                ],
            },
            {
                path: 'payment-options',
                canActivate: [UserGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                '../public/payment-options/payment-options.module'
                            ).then((m) => m.PaymentOptionsPageModule),
                    },
                ],
            },
            {
                path: 'food-orders',
                canActivate: [UserGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                '../public/food-orders/food-orders.module'
                            ).then((m) => m.FoodOrdersPageModule),
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TastyTonguePageRoutingModule {}
