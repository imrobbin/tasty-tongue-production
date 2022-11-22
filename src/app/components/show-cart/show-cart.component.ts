import { StorageService } from 'src/app/services/storage.service';
import { Address } from './../../services/address.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';

import { LoadingService } from 'src/app/services/loading.service';
import { AddressService } from 'src/app/services/address.service';
import { environment } from 'src/environments/environment';
import { CartService, Cart } from 'src/app/services/cart.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
    selector: 'app-show-cart',
    templateUrl: './show-cart.component.html',
    styleUrls: ['./show-cart.component.scss'],
})
export class ShowCartComponent implements OnInit {
    public thumbnailURL = environment.defaultImageThumb;

    public cart: Cart;
    public cartData$: Observable<any>;

    public address: Address;
    public addressData$: Observable<any>;

    public isAddressExist = false;

    constructor(
        private modalCtrl: ModalController,
        private addressService: AddressService,
        private loadingService: LoadingService,
        private cartService: CartService,
        private ordersService: OrdersService,
        private storageService: StorageService
    ) {}

    ngOnInit() {}

    async ionViewWillEnter() {
        const userData = await this.storageService.getObject('user');

        this.cartData$ = this.cartService.getUsersCart(userData.owner);
        this.cartData$.subscribe((cart) => {
            this.cart = cart;

            // when user delete all products from cart view
            if (this.cart.totalItems === 0 && this.cart.cartTotal === 0) {
                this.modalCtrl.dismiss(null, 'confirm');
            }
        });

        this.addressData$ = this.addressService.getUsersAddress(userData.owner);

        this.addressData$.subscribe((address) => {
            this.isAddressExist = address && address.address ? true : false;
            this.address = address;
            console.log(this.address);
        });
    }

    // async ionViewWillLeave() {
    //     this.ordersService.orderSubject.unsubscribe();
    //     this.cartService.cartSubject.unsubscribe();
    // }

    add(product: any) {
        product.quantity++;
        this.cartService.createProductDataBeforeAdd(product);
    }

    remove(product: any) {
        product.quantity--;
        this.cartService.createProductDataBeforeAdd(product);
    }

    async proceedToPlaceOrder(cartData: Cart) {
        await this.loadingService.showLoading('Placing Order');
        try {
            const u = this.storageService.getObject('user');
            const d = this.storageService.getObject('device');
            const [userData, deviceData] = await Promise.all([u, d]);

            const orderData = {
                id: '0',
                orderedBy: {
                    owner: userData.owner,
                    displayName: userData.displayName,
                    email: userData.email,
                    photoURL: userData.photoURL,
                },
                notify: {
                    deviceToken: deviceData.token,
                },
                orderToken: '',
                address: this.address,
                cart: cartData,
                orderStatus: 'Pending',
            };

            await this.ordersService.addOrder(orderData);
        } catch (error) {
            console.log(error);
        }
        await this.loadingService.hideLoading();
    }

    async addDeliveryAddress(addressAction: string, addressData: any) {
        this.modalCtrl
            .create({
                component: ForgotPasswordComponent,
                backdropDismiss: false,
                componentProps: {
                    componentData: {
                        title: addressAction + ' Address',
                        openView: 'add-address',
                        action: addressAction, // add, change
                        addressData,
                    },
                },
                cssClass: 'half-modal',
                presentingElement: await this.modalCtrl.getTop(),
            })
            .then((modalEl) => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then((resultData) => {
                if (resultData.role === 'confirm') {
                    // some code if required.
                }
            });
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }
}
