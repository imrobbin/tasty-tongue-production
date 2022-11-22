import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';

import { Platform } from '@ionic/angular';
import {
    Plugins,
    PushNotification,
    PushNotificationToken,
    PushNotificationActionPerformed,
} from '@capacitor/core';
const { PushNotifications } = Plugins;
const { FCMPlugin } = Plugins;

import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    public notifications: PushNotification[] = [];

    private devTokensCollection: AngularFirestoreCollection<any>;

    constructor(
        private platform: Platform,
        private afs: AngularFirestore,
        private afm: AngularFireMessaging,
        private storageService: StorageService,
        private loadingService: LoadingService
    ) {
        this.devTokensCollection = this.afs.collection<any>('deviceTokens');
    }

    public async requestNotificationPermission() {
        if (this.platform.is('hybrid')) {
            console.log(this.platform.platforms());
            // Request permission to use push notifications
            // iOS will prompt user and return if they granted permission or not
            // Android will just grant without prompting
            PushNotifications.requestPermission().then(async (result) => {
                if (result.granted) {
                    // Register with Apple / Google to receive push via APNS/FCM
                    PushNotifications.register();
                    this.registerPushNotification();
                } else {
                    // Show some error
                    await this.loadingService.showMessage(
                        'Permission denied, you may not get the notification',
                        'warning'
                    );
                }
            });
        } else if (!this.platform.is('hybrid')) {
            this.getTokenForBrowser();
        }
    }
    private getTokenForBrowser() {
        this.afm.requestToken.subscribe(
            (token) => {
                console.log('Permission granted! Save to the server!', token);
                this.saveToken(token);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    public registerPushNotification() {
        if (!this.platform.is('hybrid')) {
            this.getTokenForBrowser();
            this.afm.onMessage((payload) => {
                console.log('Notifications received.', payload);
            });
            return;
        }

        PushNotifications.addListener(
            'registration',
            (token: PushNotificationToken) => {
                console.log(
                    'Push registration success ' + JSON.stringify(token)
                );
                this.getToken();
            }
        );

        PushNotifications.addListener('registrationError', (error: any) => {
            console.log('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotification) => {
                console.log('Push received: ' + JSON.stringify(notification));
            }
        );

        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
                console.log(
                    'Push action performed: ' + JSON.stringify(notification)
                );
            }
        );
    }

    async getToken() {
        try {
            const result = await FCMPlugin.getToken();
            console.log('Push registration success ' + JSON.stringify(result));
            await this.saveToken(result.token);
        } catch (error) {
            console.log(error);
        }
    }

    private async saveToken(token: any) {
        if (!token) {
            return;
        }

        let userDevice = await this.storageService.getObject('device');

        if (userDevice && userDevice.id) {
            userDevice.token = token;
            this.devTokensCollection.doc(userDevice.id).update(userDevice);
        } else {
            const userData = await this.storageService.getObject('user');
            const id = this.afs.createId();
            userDevice = {
                id,
                token,
                owner: userData.owner,
                isAdmin: userData.isAdmin,
            };
            this.devTokensCollection.doc(userDevice.id).set(userDevice);
        }

        await this.storageService.setObject('device', userDevice);
    }

    public async deleteDeviceTokenOnLogout() {
        try {
            const userDevice = await this.storageService.getObject('device');

            if (this.platform.is('hybrid')) {
                await FCMPlugin.deleteInstance();
            } else {
                this.afm.getToken
                    .pipe(mergeMap((token) => this.afm.deleteToken(token)))
                    .subscribe((token) => {
                        console.log('Token deleted!');
                    });
            }

            await this.devTokensCollection.doc(userDevice.id).delete();
            return true;
        } catch (error) {
            console.log('error at deleteDeviceTokenOnLogout ', error);
            return false;
        }
    }
}
