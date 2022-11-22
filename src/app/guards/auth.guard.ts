import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        const value = await this.authService.isLoggedIn();
        if (value) {
            return true;
        }
        this.router.navigateByUrl('/welcome');
        return false;
    }
}
