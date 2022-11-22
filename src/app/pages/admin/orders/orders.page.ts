import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { environment } from 'src/environments/environment';
import { Order, OrdersService } from 'src/app/services/orders.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {
    public thumbnailURL = environment.defaultImageThumb;
    public isDataLoaded = false;

    public allOrders: Order[] = [];
    public allOrdersData$: Observable<Order[]>;

    public pendingOrders: Order[] = [];

    public acceptedOrders: Order[] = [];

    public deliveredOrders: Order[] = [];

    orderType = 'Pending';

    constructor(
        public ordersService: OrdersService,
        private alertCtrl: AlertController,
        private callNumber: CallNumber
    ) {}

    ngOnInit() {
        // console.log('ngOnInit()');
    }

    async ionViewWillEnter() {
        this.allOrdersData$ = this.ordersService.getAllOrders();
        this.allOrdersData$.subscribe((val) => {
            this.allOrders = val;

            this.pendingOrders = this.allOrders.filter((order: Order) => {
                order.isExpanded = false;
                return order.orderStatus.toLowerCase() === 'pending';
            });
            this.acceptedOrders = this.allOrders.filter((order: Order) => {
                order.isExpanded = false;
                return order.orderStatus.toLowerCase() === 'accepted';
            });
            this.deliveredOrders = this.allOrders.filter((order: Order) => {
                order.isExpanded = false;
                return order.orderStatus.toLowerCase() === 'delivered';
            });

            this.isDataLoaded = true;

            // console.log(`All orders `, this.allOrders);
            // console.log(`Pending orders `, this.pendingOrders);
            // console.log(`Accepted orders `, this.acceptedOrders);
            // console.log(`Delivered orders `, this.deliveredOrders);
        });
    }

    async ngOnDestroy() {
        // this.ordersService.orderSubject.unsubscribe();
    }

    async pendingOrderAccepted(order: Order) {
        order.orderStatus = 'Accepted';
        await this.ordersService.updateOrderStatus(order);
    }

    async acceptedOrderDelivered(order: Order) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm Delivered',
            message: 'Are you sure to make this order as Delivered?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {},
                },
                {
                    text: 'Yes',
                    handler: async () => {
                        order.orderStatus = 'Delivered';
                        await this.ordersService.updateOrderStatus(order);
                    },
                },
            ],
        });

        await alert.present();
    }

    async cancelOrder(order: Order) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm Cancellation',
            message: 'Are you sure to cancel this order?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {},
                },
                {
                    text: 'Yes',
                    handler: async () => {
                        order.orderStatus = 'Cancelled';
                        await this.ordersService.updateOrderStatus(order);
                    },
                },
            ],
        });

        await alert.present();
    }

    makeCallToClient(phoneNumber: any) {
        this.callNumber
            .callNumber(phoneNumber, true)
            .then((res) => console.log('Launched dialer!', res))
            .catch((err) => console.log('Error launching dialer', err));
    }

    toggleOrders(order: Order) {
        // order.isExpanded = !order.isExpanded;
        if (order.isExpanded) {
            order.isExpanded = false;
        } else {
            order.isExpanded = true;
        }
    }
}
