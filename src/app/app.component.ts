import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Plugins, StatusBarStyle } from '@capacitor/core';
const { SplashScreen, StatusBar } = Plugins;

import { BackButtonService } from './services/back-button.service';
import { NetworkService } from './services/network.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(
        private platform: Platform,
        private backButtonService: BackButtonService,
        private networkService: NetworkService,
        private storageService: StorageService,
        private notificationService: NotificationService
    ) {
        this.initializeApp();
    }

    ngOnInit() {}

    async initializeApp() {
        this.platform.ready().then(async () => {
            try {
                if (this.platform.is('hybrid')) {
                    await StatusBar.setStyle({ style: StatusBarStyle.Dark });
                    await StatusBar.setBackgroundColor({ color: '#ea750b' });
                    await SplashScreen.hide();
                }

                this.backButtonService.registerBackButton();

                this.networkService.getNetworkStatus();

                this.networkService.ntwkStatusSubject.subscribe((status) => {
                    console.log('listener network ', status);
                    if (status === false) {
                        this.networkService.showNoInternetToast();
                    } else if (status === true) {
                        this.networkService.showBackOnlineToast();
                    }
                });

                // this.getLoggedInUserData();
            } catch (error) {
                console.error(error);
            }
        });
    }

    async getLoggedInUserData() {
        const userData = await this.storageService.getObject('user');

        if (userData !== undefined) {
            await this.notificationService.requestNotificationPermission();
        }
        // else {
        //     console.log('Waiting for userData');
        //     this.getLoggedInUserData();
        // }
    }

    ngOnDestroy() {
        this.networkService.stopNetworkListener();
    }
}
