import { Product, ProductService } from 'src/app/services/product.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, combineLatest } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

export interface Cart {
    products: Product[];
    cartTotal: number;
    totalItems: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {
    items = {
        products: [],
        cartTotal: 0,
        totalItems: 0,
    };

    public carts: Observable<Cart>;
    public cartSubject = new BehaviorSubject<any>(this.carts);
    private cartsCollection: AngularFirestoreCollection<Cart>;

    productWithCart: Observable<Product[]>;
    private productWithCartSubject = new BehaviorSubject<any>(
        this.productWithCart
    );

    constructor(
        private afs: AngularFirestore,
        private storageService: StorageService,
        private productService: ProductService
    ) {
        this.cartsCollection = this.afs.collection<Cart>('carts');

        // this.carts = this.cartsCollection
        //     .doc(this.userData.owner)
        //     .snapshotChanges()
        //     .pipe(
        //         // tap((data) => {
        //         //     console.log(' Cart =========== ', data);
        //         //     this.cartSubject.next(this.carts);
        //         // }),
        //         map((snaps) => {
        //             const data = snaps.payload.data();
        //             return data;
        //         }),
        //         catchError(this.handleError)
        //     );

        // this.getUsersCart();
    }

    public createProductDataBeforeAdd(product: any) {
        const productData = {
            id: product.id,
            title: product.title,
            thumbnailURL: product.thumbnailURL,
            bannerURL: product.bannerURL,
            price: product.price,
            quantity: product.quantity,
            amount: product.quantity * product.price,
            summary: product.summary,
        };
        this.addItemToCart(productData);
    }

    private addItemToCart(product: Product) {
        this.items.products = this.items.products.filter((item) => {
            return item.id !== product.id;
        });

        if (product.quantity > 0) {
            this.items.products.push(product);
        }

        this.items.cartTotal = this.getCartTotalAmount();
        this.items.totalItems = this.getTotalItemsInCart();

        console.log('Adding Product ', this.items);

        // delete the document if nothing in cart ==> from server
        if (this.items.totalItems === 0 && this.items.cartTotal === 0) {
            this.deleteCart();
            console.log('deleting form server');
            return;
        }

        this.addProductToCart(this.items);
    }

    private getCartTotalAmount() {
        return this.items.products.reduce((total, item) => {
            return total + item.amount;
        }, 0);
    }
    private getTotalItemsInCart() {
        return this.items.products.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    }

    // async getUsersCartData() {
    //     const userData = await this.storageService.getObject('user');

    //     this.carts = this.cartsCollection
    //         .doc<Cart>(userData.owner)
    //         .valueChanges()
    //         .pipe(
    //             tap((snaps) => console.log('Cart ==============', snaps)),
    //             map((snaps) => {
    //                 const data = snaps as Cart;
    //                 this.storageService.setObject('cart', data);
    //                 if (data && data.products.length !== 0) {
    //                     this.items.products = data.products;
    //                     this.items.totalItems = data.totalItems;
    //                     this.items.cartTotal = data.cartTotal;

    //                     return { ...data };
    //                 }
    //             }),
    //             shareReplay(1),
    //             catchError(this.handleError)
    //         );

    //     this.cartSubject.next(this.carts);

    //     const isCartDataExist = await this.storageService.getObject('cart');
    //     if (isCartDataExist && isCartDataExist.products.length !== 0) {
    //         this.productWithCart = combineLatest([
    //             this.carts,
    //             this.productService.getAllProducts(),
    //         ]).pipe(
    //             tap((data) =>
    //                 console.log('Products With Cart =========', data)
    //             ),
    //             map(([carts, products]) => {
    //                 return products.map((product: any) => {
    //                     carts.products.forEach((cart) => {
    //                         if (cart.id === product.id) {
    //                             product.quantity = cart.quantity;
    //                         }
    //                     });
    //                     return { ...product } as Product;
    //                 });
    //             }),
    //             shareReplay(1),
    //             catchError(this.handleError)
    //         );

    //         this.productWithCartSubject.next(this.productWithCart);
    //     } else {
    //         this.productWithCart = this.productService.getAllProducts();
    //         this.productWithCartSubject.next(this.productWithCart);
    //     }
    // }

    getUsersCart(userId: any): Observable<Cart> {
        // this.storageService.getObject('user').then((userData) => {
        this.carts = this.cartsCollection
            .doc<Cart>(userId)
            .valueChanges()
            .pipe(
                tap((cart) => console.log('user cart ===== ', cart)),
                map((cart) => {
                    let cartData = cart as Cart;

                    if (cartData !== undefined) {
                        this.storageService.setObject('cart', cartData);

                        this.items.products = cartData.products;
                        this.items.totalItems = cartData.totalItems;
                        this.items.cartTotal = cartData.cartTotal;

                        return { ...this.items };
                    }
                    return (cartData = {
                        products: [],
                        cartTotal: 0,
                        totalItems: 0,
                    });
                }),
                shareReplay(1),
                catchError(this.handleError)
            );

        this.cartSubject.next(this.carts);
        return this.carts;
        // });
        // return this.carts;
    }

    private async addProductToCart(productData: any): Promise<void> {
        try {
            const userData = await this.storageService.getObject('user');
            this.cartsCollection.doc(userData.owner).set(productData);
        } catch (error) {
            console.log('error at addProductToCart ', error);
        }
    }

    public async deleteCart(): Promise<any> {
        try {
            const userData = await this.storageService.getObject('user');
            await this.cartsCollection.doc(userData.owner).delete();
            await this.storageService.removeObject('cart');
        } catch (error) {
            console.log('error at deleteCart ', error);
        }
    }

    private handleError(err: any) {
        console.log(err);
        let errorMsg: string;
        if (err.error instanceof ErrorEvent) {
            errorMsg = `An error occurred: ${err.error.message}`;
        } else {
            errorMsg = `Backend returned code ${err.status} : ${err.body.error}`;
        }

        return throwError(errorMsg);
    }
}
