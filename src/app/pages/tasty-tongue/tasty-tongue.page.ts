import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';

import { Plugins, ShareOptions } from '@capacitor/core';

const { Share } = Plugins;

@Component({
    selector: 'app-tasty-tongue',
    templateUrl: './tasty-tongue.page.html',
    styleUrls: ['./tasty-tongue.page.scss'],
})
export class TastyTonguePage implements OnInit {
    public selectedIndex = 0;
    public appPages = [
        {
            title: 'Menu',
            url: '/tastytongue/menu',
            icon: 'grid',
            alias: 'menu',
            isForAdmin: false,
        },
        // {
        //     title: 'Payment Options',
        //     url: '/tastytongue/payment-options',
        //     icon: 'home',
        //     alias: 'payment-options',
        //     isForAdmin: false,
        // },
        {
            title: 'Food Orders',
            url: '/tastytongue/food-orders',
            icon: 'basket',
            alias: 'food-orders',
            isForAdmin: false,
        },
        {
            title: 'Orders',
            url: '/tastytongue/orders',
            icon: 'basket',
            alias: 'orders',
            isForAdmin: true,
        },
        {
            title: 'Products',
            url: '/tastytongue/products',
            icon: 'grid',
            alias: 'products',
            isForAdmin: true,
        },
    ];

    public defaultImageThumb = environment.defaultImageThumb;

    public userData: any;
    constructor(
        private storageService: StorageService,
        public authService: AuthService
    ) {}

    ngOnInit() {}

    async share() {
        const shareObject: ShareOptions = {
            title: '',
            text: `Hey i'm using Tasty Tongue to order food. Download it and enjoy your food at home.`,
            url: '',
            dialogTitle: '',
        };
        await Share.share(shareObject);
    }

    async ionViewWillEnter() {
        console.log('ionViewWillEnter');
        this.userData = await this.storageService.getObject('user');
        this.appPages = this.appPages.filter((page) => {
            return page.isForAdmin === this.userData.isAdmin;
        });

        const path = window.location.pathname.split('tastytongue/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(
                (page) => page.alias.toLowerCase() === path.toLowerCase()
            );
        }
    }
}
