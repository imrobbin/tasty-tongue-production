import { StorageService } from '../services/storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UserGuard implements CanActivate {
    sourceURL: any;

    constructor(
        private router: Router,
        private storageService: StorageService
    ) {}
    async canActivate(): Promise<boolean> {
        // pick the current url
        this.sourceURL = this.router.url;

        const value = await this.storageService.getObject('user');
        // only allowed to users
        if (value && value.isAdmin === false) {
            return true;
        }

        // navigate back to the source url
        this.router.navigateByUrl(this.sourceURL);
        return false;
    }
}
