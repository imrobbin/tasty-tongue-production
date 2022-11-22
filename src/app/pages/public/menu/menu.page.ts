import { StorageService } from './../../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { ProductService, Product } from 'src/app/services/product.service';
import { CartService, Cart } from 'src/app/services/cart.service';

import { ShowCartComponent } from 'src/app/components/show-cart/show-cart.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
    public defaultImageBanner = environment.defaultImageBanner;
    public isDataLoaded = false;
    // to disable the add to cart button
    public isShopOpen = false;

    public cart: any;
    public cartData$: Observable<Cart>;

    products: any;
    public productsData$: Observable<Product>;
    public productsList: any = [];

    constructor(
        public cartService: CartService,
        public productService: ProductService,
        private modalCtrl: ModalController,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        // Store messages in an array
        const data = [
            ['6:59', '10:59', 'We Are Open', 'We Are Closed'],
            ['15:59', '18:59', 'We Are Open', 'We Are Closed'],
        ];

        const hr = new Date().getHours();

        const mn = new Date().getMinutes();

        for (const d of data) {
            const open = d[0].split(':');
            const close = d[1].split(':');
            if (
                hr >= +open[0] &&
                mn <= +open[1] &&
                hr <= +close[0] &&
                mn <= +close[1]
            ) {
                this.isShopOpen = true;
                console.log(d[2], this.isShopOpen);
            } else {
                console.log(d[3], this.isShopOpen);
            }
        }
    }

    async ionViewWillEnter() {
        // subcribe to the cart service cartData which gets all the server data

        const userData = await this.storageService.getObject('user');
        this.cartData$ = this.cartService.getUsersCart(userData.owner);

        this.productsList = await this.productService.getProductsList();

        console.log(this.productsList);

        this.patchProductQuantity();
    }

    // async ionViewWillLeave() {
    //     this.cartService.cartSubject.unsubscribe();
    //     this.productService.productSubject.unsubscribe();
    // }

    patchProductQuantity() {
        this.cartData$.subscribe((cart) => {
            if (cart.products.length !== 0) {
                this.productsList.filter((p) => {
                    cart.products.filter((c) => {
                        if (c.id === p.id) {
                            p.quantity = c.quantity;
                        }
                    });
                });
            }

            this.isDataLoaded = true;
        });
    }

    async showCartDetails() {
        this.modalCtrl
            .create({
                component: ShowCartComponent,
                backdropDismiss: false,
                presentingElement: await this.modalCtrl.getTop(),
            })
            .then((modalEl) => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then((resultData) => {
                if (resultData.role === 'confirm') {
                    // some code if required. load the products list
                    this.ionViewWillEnter();
                }
            });
    }

    add(product: any) {
        product.quantity++;
        this.cartService.createProductDataBeforeAdd(product);
    }

    remove(product: any) {
        product.quantity--;
        this.cartService.createProductDataBeforeAdd(product);
    }

    async toggleSummary(product: any) {
        // product.isExpanded = !product.isExpanded;
        if (product.isExpanded) {
            product.isExpanded = false;
        } else {
            product.isExpanded = true;
        }
    }
}
