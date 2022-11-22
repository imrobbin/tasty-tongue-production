import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import {
    Platform,
    ModalController,
    ActionSheetController,
    NavController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

const { App, Toast } = Plugins;

@Injectable({
    providedIn: 'root',
})
export class BackButtonService {
    lastTimeBackPress = 0;
    timePeriodToExit = 2000;

    exitFromPage = [
        '/tastytongue/menu',
        '/tastytongue/payment-options',
        '/tastytongue/food-orders',
        '/tastytongue/products',
        '/tastytongue/orders',
        '/welcome',
    ];

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly actionSheetCtrl: ActionSheetController,
        private readonly platform: Platform,
        private readonly router: Router,

        private storageService: StorageService,
        private navCtrl: NavController
    ) {}

    async registerBackButton() {
        if (this.platform.is('hybrid')) {
            App.addListener('backButton', async () => {
                try {
                    let element: any;

                    // close action sheet
                    element = await this.actionSheetCtrl.getTop();
                    if (element) {
                        element.dismiss();
                        return;
                    }

                    // close modal
                    element = await this.modalCtrl.getTop();
                    if (element) {
                        element.dismiss();
                        return;
                    }

                    if (this.exitFromPage.includes(this.router.url)) {
                        if (this.router.url === '/welcome') {
                            App.exitApp();
                            return;
                        }

                        const userData = await this.storageService.getObject(
                            'user'
                        );
                        // set back to main page before exit
                        if (
                            userData.isAdmin &&
                            this.router.url !== '/tastytongue/orders'
                        ) {
                            this.navCtrl.back();
                            return;
                        } else if (
                            !userData.isAdmin &&
                            this.router.url !== '/tastytongue/menu'
                        ) {
                            this.navCtrl.back();
                            return;
                        }

                        const tapIn =
                            new Date().getTime() - this.lastTimeBackPress;
                        if (tapIn < this.timePeriodToExit) {
                            App.exitApp();
                        } else {
                            await Toast.show({
                                text: 'Press again to exit Tasty Tongue',
                                duration: 'short',
                                position: 'bottom',
                            });
                            this.lastTimeBackPress = new Date().getTime();
                        }
                    } else {
                        this.lastTimeBackPress = 0;
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }
}
