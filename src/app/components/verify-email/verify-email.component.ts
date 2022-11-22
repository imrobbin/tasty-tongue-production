import { LoadingService } from './../../services/loading.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
    public userData: any;
    public timer: any;
    constructor(
        private router: Router,
        public authService: AuthService,
        private modalCtrl: ModalController,
        private loadingService: LoadingService
    ) {}

    async ngOnInit() {
        this.userData = await this.authService.getUserState();
    }

    // start interval to check status
    ionViewDidEnter() {
        this.timer = setInterval(
            this.checkEmailVerified,
            8000,
            this.authService
        );
    }

    // stop interval on exit component
    ionViewDidLeave() {
        clearInterval(this.timer);
    }

    // setInterval() will continuously call isEmailVerified() to check the status of user
    async checkEmailVerified(authService: any) {
        authService.isEmailVerified();
    }

    async resendVerificationMail() {
        await this.loadingService.showLoading();
        await this.authService.sendVerificationMail();
        await this.loadingService.hideLoading();
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }
}
