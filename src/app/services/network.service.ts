import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Plugins, NetworkStatus } from '@capacitor/core';

const { Network } = Plugins;

@Injectable({
    providedIn: 'root',
})
export class NetworkService {
    status: NetworkStatus;
    listener: any;
    ntwkStatusSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private toastCtrl: ToastController) {}

    async getNetworkStatus() {
        try {
            this.status = await Network.getStatus();
            this.startNetworkListener();
        } catch (e) {
            console.log('Error', e);
        }
    }

    startNetworkListener() {
        this.listener = Network.addListener('networkStatusChange', (status) => {
            this.ntwkStatusSubject.next(status.connected);
        });
    }

    stopNetworkListener() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    async showNoInternetToast() {
        const toast = await this.toastCtrl.create({
            message: 'No Internet',
            duration: 3000,
            position: 'bottom',
        });

        toast.present();
    }
    async showBackOnlineToast() {
        const toast = await this.toastCtrl.create({
            message: 'Back Online',
            duration: 3000,
            position: 'bottom',
            color: 'success',
        });

        toast.present();
    }
}
