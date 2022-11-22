import { ProductService } from 'src/app/services/product.service';
import { OrdersService } from 'src/app/services/orders.service';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, tap, map } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

import { ModalController, AlertController } from '@ionic/angular';
import { LoadingService } from './loading.service';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

export interface Credentials {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private alertController: AlertController,
        private modalCtrl: ModalController,
        private router: Router,
        private afAuth: AngularFireAuth,
        private storageService: StorageService,
        private loadingService: LoadingService,
        private userService: UserService,
        private cartService: CartService,
        private ordersService: OrdersService,
        private productService: ProductService,
        private notificationService: NotificationService
    ) {
        this.afAuth.authState
            .pipe(
                tap((u) => console.log('= Auth = ', u)),
                first()
            )
            .toPromise();
    }

    getUserState(): Promise<firebase.User> {
        return this.afAuth.authState.pipe(first()).toPromise();
    }

    // Login in with email/password
    async login(
        credentials: Credentials
    ): Promise<firebase.auth.UserCredential> {
        await this.afAuth.signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        );
        const userData: any = await this.getUserState();

        return userData;
    }

    // Register user with email/password
    async register(
        credentials: Credentials
    ): Promise<firebase.auth.UserCredential> {
        const result: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
            credentials.email,
            credentials.password
        );

        await this.sendVerificationMail();

        // store the user data to db
        const userData = {
            owner: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            emailVerified: result.user.emailVerified,
            isAdmin: false,
        };
        // await this.userService.addUser(userData);

        return result;
    }

    // Email verification when new user register
    async sendVerificationMail() {
        const user = await this.afAuth.currentUser;
        user.sendEmailVerification();
    }

    // Recover password
    async passwordReset(passwordResetEmail) {
        try {
            await this.afAuth.sendPasswordResetEmail(passwordResetEmail);

            const alert = await this.alertController.create({
                header: 'Email Sent',
                message:
                    'Password reset email has been sent, please check your inbox.',
                buttons: ['OK'],
            });

            await alert.present();
        } catch (error) {
            this.loadingService.showMessage(error, 'danger');
        }
    }

    // Returns true when user is looged in
    async isLoggedIn(): Promise<boolean> {
        const user = await this.storageService.getObject('user');

        const isValidUser =
            user !== undefined && user.emailVerified !== false ? true : false;
        console.log('isValidUser ', isValidUser);
        return isValidUser;
    }

    // Sign in with Gmail
    async continueWithGoogle() {
        const googleUser = await Plugins.GoogleAuth.signIn();
        const googleCredentials = firebase.auth.GoogleAuthProvider.credential(
            googleUser.authentication.idToken
        );

        return await this.GoogleAuthLogin(googleCredentials);
    }

    // Auth providers
    async GoogleAuthLogin(credentials: any): Promise<any> {
        const result = await this.afAuth.signInWithCredential(credentials);

        // store the user data to db
        const userData = {
            owner: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            emailVerified: result.user.emailVerified,
            isAdmin: false,
        };

        await this.userService.updateUser(userData);
        await this.storageService.setObject('user', userData);

        await this.notificationService.requestNotificationPermission();

        return userData;
    }

    isEmailVerified(): Promise<firebase.Unsubscribe> {
        firebase.auth().currentUser.reload();

        return this.afAuth.onAuthStateChanged(async (user) => {
            // if true do login else wait for to be true
            if (user && user.emailVerified) {
                // update the changed data
                const userData = {
                    owner: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    isAdmin: false,
                };

                await this.userService.updateUser(userData);
                await this.storageService.setObject('user', userData);

                this.modalCtrl.dismiss(null, 'verified');
                await this.router.navigateByUrl('tastytongue', {
                    replaceUrl: true,
                });

                await this.notificationService.requestNotificationPermission();

                return true;
            } else {
                return false;
            }
        });
    }

    async addUserDataEmailExistButNotData(): Promise<any> {
        const result: any = await this.getUserState();
        // store the user data to db
        const userData = {
            owner: result.uid,
            email: result.email,
            displayName: result.displayName,
            photoURL: result.photoURL,
            emailVerified: result.emailVerified,
            isAdmin: false,
        };

        await this.userService.updateUser(userData);
    }

    // Sign-out
    async logout() {
        await this.loadingService.showLoading();

        const res: any = await this.notificationService.deleteDeviceTokenOnLogout();
        if (res === true) {
            // this.productService.productSubject.unsubscribe();

            // this.cartService.cartSubject.unsubscribe();

            // this.ordersService.orderSubject.unsubscribe();

            await this.afAuth.signOut();
            await this.storageService.clearAllObjects();
            await this.router.navigate(['/welcome'], { replaceUrl: true });
        }

        await this.loadingService.hideLoading();
    }
}
