import { Component, Input, OnInit } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-edit-image',
    templateUrl: './edit-image.component.html',
    styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
    @Input() public userData: any;

    // all values are default value for profile picture
    public cropRatio = 1.91 / 1;
    public cropperMinWidth = 320; // cropper min width
    public resizeToWidth = 1080; // resize final cropped image (width in px)
    public imageToCrop: any; // selected image to crop
    public croppedImage: any = ''; // final cropped image
    public showCropper = false;
    public imageChangedEvent: any = '';

    public rotateImageBy = 0;

    constructor(
        private readonly platform: Platform,
        private modalCtrl: ModalController,
        private loadingService: LoadingService
    ) {}

    public async ngOnInit() {
        console.log('userData ', this.userData);
        await this.loadingService.showLoading();

        if (this.platform.is('hybrid')) {
            this.imageToCrop = this.userData.imageData.webPath;
        } else {
            this.imageToCrop = this.userData.imageData;
        }

        // if (this.userData.imageSource === 'add-photo') {
        //     this.resizeToWidth = 1080; // height will be relative to aspect ratio
        //     this.cropperMinWidth = 320; // height will be relative to aspect ratio
        // }
    }

    public imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    public async imageLoaded() {
        console.log('imageLoaded');
        this.showCropper = true;
        await this.loadingService.hideLoading();
    }
    public cropperReady() {
        console.log('cropperReady');
    }
    public async loadImageFailed() {
        console.log('loadImageFailed');
        await this.loadingService.hideLoading();
    }

    public rotateImage() {
        // rotate the image 1=90deg 2=180deg ...
        this.rotateImageBy++;
    }

    public croppingDone() {
        this.modalCtrl.dismiss({ imageData: this.croppedImage }, 'confirm');
    }

    public croppingCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

    // public imageCroppingRatio(_ratio: string) {
    //     if (_ratio === 'square') {
    //         this.cropRatio = 1 / 1;
    //     } else if (_ratio === 'portrait') {
    //         this.cropRatio = 4 / 5;
    //     } else if (_ratio === 'landscape') {
    //         this.cropRatio = 1.91 / 1;
    //     }
    // }
}
