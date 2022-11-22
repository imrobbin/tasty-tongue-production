import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { StorageService } from 'src/app/services/storage.service';
import { Order, OrdersService } from 'src/app/services/orders.service';

@Component({
    selector: 'app-food-orders',
    templateUrl: './food-orders.page.html',
    styleUrls: ['./food-orders.page.scss'],
})
export class FoodOrdersPage implements OnInit {
    public thumbnailURL = environment.defaultImageThumb;
    public isDataLoaded = false;

    public myOrders: Order[] = [];
    public myOrdersData$: Observable<Order[]>;

    constructor(
        public ordersService: OrdersService,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController,
        private storageService: StorageService
    ) {}

    ngOnInit() {}

    async ionViewWillEnter() {
        const userData = await this.storageService.getObject('user');
        this.myOrdersData$ = this.ordersService.getOrdersForUser(userData.owner);

        this.myOrdersData$.subscribe((orders) => {
            orders.map((order) => {
                order.isExpanded = false;
            });
            this.myOrders = orders;
            this.isDataLoaded = true;
        });
    }

    // async ionViewWillLeave() {
    //     this.ordersService.orderSubject.unsubscribe();
    // }

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

    toggleOrders(order: Order) {
        // order.isExpanded = !order.isExpanded;
        if (order.isExpanded) {
            order.isExpanded = false;
        } else {
            order.isExpanded = true;
        }
    }
}
