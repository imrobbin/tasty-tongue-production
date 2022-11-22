import { StorageService } from '../services/storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    sourceURL: any;
    constructor(
        private router: Router,
        private storageService: StorageService
    ) {}
    async canActivate(): Promise<boolean> {
        this.sourceURL = this.router.url;

        const value = await this.storageService.getObject('user');
        // only allowed to admin
        if (value && value.isAdmin === true) {
            return true;
        }

        // navigate to the landing page
        if (this.sourceURL === '/welcome') {
            // only in case of user login .. on success login redirect to menu
            this.sourceURL = '/tastytongue/menu';
        } else if (this.sourceURL === '/') {
            this.sourceURL = '/tastytongue/menu';
        }

        // navigate back to the current url
        this.router.navigateByUrl(this.sourceURL);
        return false;
    }
}
