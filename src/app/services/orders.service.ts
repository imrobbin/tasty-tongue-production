import { CartService } from 'src/app/services/cart.service';
import { LoadingService } from './loading.service';
import { Address } from './address.service';
import { Cart } from './cart.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { catchError, tap, shareReplay, first, takeUntil } from 'rxjs/operators';

export interface Order {
    id: string;
    orderedBy: {
        owner: string;
        displayName: string;
        email: string;
        photoURL: string;
    };
    notify: {
        deviceToken: string;
    };
    orderToken: string;
    address: Address;
    cart: Cart;
    orderStatus: string;
    orderDate?: string;
    isExpanded?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    private orderCollection: AngularFirestoreCollection<Order>;

    public orders: Observable<Order[]>;
    public orderSubject = new BehaviorSubject<any>(this.orders);

    constructor(
        private afs: AngularFirestore,
        private storageService: StorageService,
        private loadingService: LoadingService,
        private cartService: CartService
    ) {
        this.orderCollection = this.afs.collection<Order>('orders');
    }

    // just grab the all orders
    getAllOrders(): Observable<Order[]> {
        try {
            this.orders = this.afs
                .collection<Order>('orders', (ref) =>
                    ref.orderBy('orderDate', 'desc')
                )
                .valueChanges()
                .pipe(
                    tap((orders) => console.log(`read ${orders.length} docs`)),
                    shareReplay(1),
                    // takeUntil(this.orderSubject),
                    catchError(this.handleError)
                );

            this.orderSubject.next(this.orders);
            return this.orders;
        } catch (error) {
            console.log('error at getAllOrders ', error);
        }
    }

    // to get the all orders placed by a user
    getOrdersForUser(userId: string): Observable<Order[]> {
        try {
            this.orders = this.afs
                .collection<Order>('orders', (ref) =>
                    ref
                        .where('orderedBy.owner', '==', userId)
                        .orderBy('orderDate', 'desc')
                )
                .valueChanges()
                .pipe(
                    tap((orders) =>
                        console.log(`Single User Orders === `, orders)
                    ),
                    shareReplay(1),
                    first(),
                    catchError(this.handleError)
                );

            this.orderSubject.next(this.orders);
            return this.orders;
        } catch (error) {
            console.log('error at getOrdersForUser ', error);
        }
    }

    // place an order request used by User
    async addOrder(orderData: Order): Promise<any> {
        try {
            orderData.id = this.afs.createId();
            orderData.orderDate = new Date().toISOString();
            orderData.orderToken = orderData.id.slice(4, 8).toUpperCase();

            await this.orderCollection.doc(orderData.id).set(orderData);

            // after placing order delete the cart
            await this.cartService.deleteCart();

            await this.loadingService.showMessage(
                'Order Placed, please wait for the confirmation',
                'success'
            );
        } catch (error) {
            console.log('error at addOrder ', error);
            // this.handleError(error);
            await this.loadingService.showMessage(error, 'danger');
        }
    }

    async updateOrderStatus(orderData: Order) {
        try {
            await this.orderCollection.doc(orderData.id).update(orderData);

            await this.loadingService.showMessage(
                'Order ' + orderData.orderStatus,
                'success'
            );
        } catch (error) {
            console.log('error at updateOrderStatus ', error);
            // this.handleError(error);
            await this.loadingService.showMessage(
                error.FirebaseError,
                'danger'
            );
        }
    }

    private handleError(err: any) {
        let errorMsg: string;
        if (err.error instanceof ErrorEvent) {
            errorMsg = `An error occurred: ${err.error.message}`;
        } else {
            errorMsg = `Backend returned code ${err.status} : ${err.body.error}`;
        }

        return throwError(errorMsg);
    }

    // // Get the all "Pending" status order used by admin
    // getAllPendingOrders(): Observable<Order[]> {
    //     this.orders = this.afs
    //         .collection<Order>('orders', (ref) =>
    //             ref.where('orderStatus', '==', 'Pending')
    //         )
    //         .valueChanges()
    //         .pipe(
    //             tap((orders) => console.log(`All Pending orders === `, orders)),
    //             shareReplay(1),
    //             catchError(this.handleError)
    //         );

    //     this.orderSubject.next(this.orders);
    //     return this.orders;
    // }

    // // Get the all "Confirmed" status order used by admin
    // getAllConfirmedOrders(): Observable<Order[]> {
    //     this.orders = this.afs
    //         .collection<Order>('orders', (ref) =>
    //             ref.where('orderStatus', '==', 'Confirmed')
    //         )
    //         .valueChanges()
    //         .pipe(
    //             tap((orders) =>
    //                 console.log(`All Confirmed orders === `, orders)
    //             ),
    //             shareReplay(1),
    //             catchError(this.handleError)
    //         );

    //     this.orderSubject.next(this.orders);
    //     return this.orders;
    // }

    // // Get the all "Delivered" status order used by admin
    // getAllDeliveredOrders(): Observable<Order[]> {
    //     this.orders = this.afs
    //         .collection<Order>('orders', (ref) =>
    //             ref.where('orderStatus', '==', 'Delivered')
    //         )
    //         .valueChanges()
    //         .pipe(
    //             tap((orders) =>
    //                 console.log(`All Delivered orders === `, orders)
    //             ),
    //             shareReplay(1),
    //             catchError(this.handleError)
    //         );

    //     this.orderSubject.next(this.orders);
    //     return this.orders;
    // }
}
