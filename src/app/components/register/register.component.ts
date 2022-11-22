import { VerifyEmailComponent } from './../verify-email/verify-email.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    public signupForm: FormGroup;
    public passwordTpye = 'password';
    public passwordShown = false;

    constructor(
        private router: Router,
        private modalCtrl: ModalController,
        private authService: AuthService,
        private loadingService: LoadingService
    ) {}

    ngOnInit() {
        // fields for register form
        this.signupForm = new FormGroup({
            email: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required, Validators.email],
            }),
            password: new FormControl('', {
                updateOn: 'change',
                validators: [
                    Validators.required,
                    Validators.pattern(
                        /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&])(?=.{8,})/
                    ),
                ],
            }),
        });
    }

    async _signupAction(signupForm: FormGroup): Promise<void> {
        try {
            if (!signupForm.valid) {
                this.loadingService.showMessage(
                    'Invalid email or password.',
                    'danger'
                );
                return;
            }

            await this.loadingService.showLoading();
            const credentials = {
                email: signupForm.value.email,
                password: signupForm.value.password,
            };

            await this.authService.register(credentials);

            await this.modalCtrl.dismiss(null, 'confirm');
            this.openEmailVerifyModel();
        } catch (error) {
            this.loadingService.showMessage(error.message, 'danger');
            console.log('Error on _signupAction', error);
        }
        // hide the loader either on success or error
        await this.loadingService.hideLoading();
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

    togglePassword() {
        this.passwordTpye = this.passwordShown ? 'password' : 'text';
        this.passwordShown = !this.passwordShown;
    }

    async openLogin() {
        this.modalCtrl.dismiss(null, 'cancel');
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

    async openEmailVerifyModel() {
        this.modalCtrl
            .create({
                component: VerifyEmailComponent,
                backdropDismiss: false,
                presentingElement: await this.modalCtrl.getTop(),
            })
            .then((modalEl) => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then((resultData) => {
                console.log(resultData.data, resultData.role);
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
