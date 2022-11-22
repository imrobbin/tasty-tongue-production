import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RegisterComponent } from '../register/register.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public passwordTpye = 'password';
    public passwordShown = false;

    constructor(
        private router: Router,
        private modalCtrl: ModalController,
        private alertController: AlertController,
        private authService: AuthService,
        private storageService: StorageService,
        private loadingService: LoadingService,
        private userService: UserService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // fields for register form
        this.loginForm = new FormGroup({
            email: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required, Validators.email],
            }),
            password: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required],
            }),
        });
    }

    async _loginAction(loginForm: FormGroup): Promise<void> {
        try {
            if (!loginForm.valid) {
                this.loadingService.showMessage(
                    'Invalid email or password.',
                    'danger'
                );
                return;
            }

            await this.loadingService.showLoading();

            const credentials = {
                email: loginForm.value.email,
                password: loginForm.value.password,
            };

            const loginRes: any = await this.authService.login(credentials);

            await this.modalCtrl.dismiss(null, 'confirm');

            // force to first verify the email
            if (loginRes && loginRes.emailVerified === false) {
                this.openEmailVerifyModel();
            } else {
                const userData = await this.userService.getUserById(
                    loginRes.uid
                );
                if (userData === undefined) {
                    this.loadingService.showMessage(
                        'Unable to process request. Please try again later.',
                        'warning'
                    );
                    this.authService.addUserDataEmailExistButNotData();
                } else {
                    await this.storageService.setObject('user', userData);
                    await this.router.navigateByUrl('tastytongue', {
                        replaceUrl: true,
                    });

                    await this.notificationService.requestNotificationPermission();
                }
            }
        } catch (error) {
            this.loadingService.showMessage(error.message, 'danger');
            console.log('Error on _loginAction', error);
        }
        // hide the loader either on success or error
        await this.loadingService.hideLoading();
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
                    // some code..
                }
            });
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

    togglePassword() {
        this.passwordTpye = this.passwordShown ? 'password' : 'text';
        this.passwordShown = !this.passwordShown;
    }

    public async _forgotPassword() {
        const alert = await this.alertController.create({
            header: 'Forgotten your password?',
            message:
                'Enter your email address below, and we’ll email instructions for setting a new password.',
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    value: '',
                    placeholder: 'Email Address',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {},
                },
                {
                    text: 'Reset',
                    handler: async (data) => {
                        if (!data.email) {
                            this.loadingService.showMessage(
                                'Email address not entered.',
                                'danger'
                            );
                            return;
                        }
                        await this.authService.passwordReset(data.email);
                    },
                },
            ],
        });

        await alert.present();
    }

    async openRegister() {
        this.modalCtrl.dismiss();
        await this.modalCtrl
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
