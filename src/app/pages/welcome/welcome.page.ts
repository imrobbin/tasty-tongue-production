import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { RegisterComponent } from './../../components/register/register.component';
import { LoginComponent } from './../../components/login/login.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
    constructor(
        private modalCtrl: ModalController,
        public authService: AuthService,
        private loadingService: LoadingService,
        private router: Router
    ) {}

    ngOnInit() {}

    async openLoginModel() {
        this.modalCtrl
            .create({
                component: LoginComponent,
                backdropDismiss: false,
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

    async openRegisterModel() {
        this.modalCtrl
            .create({
                component: RegisterComponent,
                backdropDismiss: false,
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

    async continueWithGoogle() {
        await this.loadingService.showLoading();
        try {
            await this.authService.continueWithGoogle();

            // navigate only when isLoggedIn is true
            await this.router.navigate(['/tastytongue'], {
                replaceUrl: true,
            });
        } catch (error) {
            this.loadingService.showMessage('Action Cancelled', 'danger');
        }
        await this.loadingService.hideLoading();
    }
}
