import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/services/cart.service';
import { ProductService, Product } from 'src/app/services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
    public defaultImageBanner = environment.defaultImageBanner;
    public isDataLoaded = false;

    public products: Product;
    public productsData$: Observable<any>;

    constructor(
        private router: Router,
        private productService: ProductService
    ) {}

    async ngOnInit() {
        this.productsData$ = this.productService.getAllProducts();

        this.productsData$.subscribe((products) => {
            this.products = products;
            this.isDataLoaded = true;
        });
    }

    async ngOnDestroy() {
        // this.productService.productSubject.unsubscribe();
    }

    async toggleSummary(product: any) {
        product.isExpanded = !product.isExpanded;
        // if (product.isExpanded) {
        //     product.isExpanded = false;
        // } else {
        //     product.isExpanded = true;
        // }
    }

    // for task
    onDeleteProduct(product: Product) {}

    onEditProduct(product: Product) {
        this.router.navigate([
            '/',
            'tastytongue',
            'products',
            'add-product',
            product.id,
        ]);
    }
}
