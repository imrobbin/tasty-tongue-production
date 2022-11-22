import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    public loading: HTMLIonLoadingElement;

    constructor(
        public loadingCtrl: LoadingController,
        public toastController: ToastController
    ) {}

    private async setLoader(msg: string = ''): Promise<any> {
        this.loading = await this.loadingCtrl.create({
            message: msg,
            spinner: 'crescent',
        });
        await this.loadingCtrl.dismiss();
        return await this.loading.present();
    }

    public async showLoading(msg: string = ''): Promise<any> {
        return await this.setLoader(msg);
    }

    public async hideLoading(): Promise<boolean> {
        return this.loading.dismiss();
    }

    public async showMessage(infoMessage: string, infoType: string) {
        const toast = await this.toastController.create({
            message: infoMessage,
            duration: 5000,
            position: 'top',
            color: infoType,
            // cssClass: 'custom-toast',
            buttons: [
                {
                    role: 'cancel',
                    icon: 'close-circle-outline',
                    handler: () => {},
                },
            ],
        });
        toast.present();
    }
}
