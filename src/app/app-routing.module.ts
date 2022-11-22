import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'tastytongue', pathMatch: 'full' },
    {
        path: 'tastytongue',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./pages/tasty-tongue/tasty-tongue.module').then(
                (m) => m.TastyTonguePageModule
            ),
    },
    {
        path: 'welcome',
        loadChildren: () =>
            import('./pages/welcome/welcome.module').then(
                (m) => m.WelcomePageModule
            ),
    },
    { path: '**', redirectTo: 'tastytongue' },
    // {
    //     path: 'products',
    //     loadChildren: () =>
    //         import('./pages/products/products.module').then(
    //             (m) => m.ProductsPageModule
    //         ),
    // },
    // {
    //     path: 'orders',
    //     loadChildren: () =>
    //         import('./pages/admin/orders/orders.module').then(
    //             (m) => m.OrdersPageModule
    //         ),
    // },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
