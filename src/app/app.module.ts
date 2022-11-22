import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// firebase imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
// for data
import { AngularFirestoreModule } from '@angular/fire/firestore';
// for image and other stuff
import { AngularFireStorageModule } from '@angular/fire/storage';
// for message and notifications
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from './../environments/environment';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ImageCropperModule } from 'ngx-image-cropper';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        LazyLoadImageModule,
        ImageCropperModule,
        ServiceWorkerModule.register('combined-sw.js', {
            enabled: environment.production,
        }),
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        CallNumber,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
