import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SkeletonComponent } from './skeleton/skeleton.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ShowCartComponent } from './show-cart/show-cart.component';
import { ProductsListComponent } from './products-list/products-list.component';

import { ImageCropperModule } from 'ngx-image-cropper';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
    imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        ImageCropperModule,
        LazyLoadImageModule,
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        EditImageComponent,
        SkeletonComponent,
        ProductsListComponent,
        ShowCartComponent,
        ForgotPasswordComponent,
    ],
    exports: [
        LazyLoadImageModule,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        EditImageComponent,
        SkeletonComponent,
        ProductsListComponent,
        ShowCartComponent,
        ForgotPasswordComponent,
    ],

    // imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class SharedComponentsModule {}
