import { map } from 'rxjs/operators';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, Input } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ProductService, Product } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
    @Input() cartData: any;
    // to store all the products in db
    public productsList: any[];

    public products: Product;
    public productsData$: Observable<any>;

    public defaultImageBanner = environment.defaultImageBanner;
    public isDataLoaded = false;
    public userData: any;

    constructor(
        private router: Router,
        private productService: ProductService,
        public cartService: CartService,
        private storageService: StorageService
    ) {}

    async ngOnInit() {
        // to check user is isAdmin
        this.userData = await this.storageService.getObject('user');

        this.productsData$ = this.productService.getAllProducts();

        this.productsData$.subscribe((products) => {
            this.products = products;
            this.isDataLoaded = true;
        });
        // this.productsData$ = this.productService.products.pipe(
        //     (products: any) => {
        //         this.productsList = products;
        //         console.log('1 ', this.isDataLoaded);

        //         console.log('2 ', this.isDataLoaded);
        //         return products;
        //     }
        // );

        console.log(this.products);
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
