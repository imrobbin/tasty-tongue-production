import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { LoadingService } from './loading.service';
import { AngularFireStorage } from '@angular/fire/storage';

// import { HttpClient } from '@angular/common/http';

const { Camera } = Plugins;

@Injectable({
    providedIn: 'root',
})
export class CameraService {
    baseUrl = 'https://mahipicapp.000webhostapp.com/mahipicapp/';
    blob: any;
    formData: any;
    constructor(
        // private afStore: AngularFireStorage,
        private loadingService: LoadingService
    ) {} // private http: HttpClient

    public async takePicture(sourceType: CameraSource): Promise<any> {
        // Take a photo
        const capturedPhoto = await Camera.getPhoto({
            quality: 100, // highest quality (0 to 100)
            resultType: CameraResultType.Uri, // file-based data; provides best performance
            source: sourceType, // take a new photo with the selected source
        });

        return capturedPhoto;
    }

    // // all process for image uploading >....DO NOT CHANGE ...<

    // async uploadImage(
    //     b64String: any
    // ): Promise<firebase.storage.UploadTaskSnapshot> {
    //     this.loadingService.hideLoading();

    //     try {
    //         const imageName = `product-${new Date().getTime()}.png`;
    //         const storageRef = firebase.storage().ref();

    //         await this.loadingService.showLoading('Uploading image.');

    //         const uploadTask = storageRef
    //             .child(`products/${imageName}`)
    //             .putString(b64String, 'data_url');

    //         // const a = uploadTask.on('state_changed', async (snapshot) => {});
    //         uploadTask.on('state_changed', (snapshot) => {
    //             const progress =
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    //             console.log('Upload is ' + progress + '% done');
    //         });

    //         const imgUrl = await uploadTask.snapshot.ref.getDownloadURL();
    //         return imgUrl;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async uploadImage(
        b64String: any
    ): Promise<firebase.storage.UploadTaskSnapshot> {
        const imageName = `product-${new Date().getTime()}.png`;
        const storageRef = firebase.storage().ref();

        return new Promise((resolve, reject) => {
            const uploadTask = storageRef
                .child(`products/${imageName}`)
                .putString(b64String, 'data_url');

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (err) => {
                    console.log('error', err);
                    reject(err);
                },
                () => {
                    uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    // uploadTask.snapshot.ref
                    //     .child(`products/${imageName}_1080x608.png`)
                    //     .getDownloadURL()
                    //     .then((downloadURL) => {
                    //         resolve(downloadURL);
                    //     });
                }
            );
        });
    }

    // async uploadImagePhoto(
    //     blobData: any,
    //     name: any,
    //     actionFor: string,
    //     action: string
    // ) {
    //     const formData = new FormData();
    //     formData.append('file', blobData, name);
    //     formData.append('name', name);

    //     let urlFor = 'profile_photo';

    //     if (actionFor === 'sample') {
    //         urlFor = 'sample_photo';
    //     }

    //     const url = this.baseUrl + urlFor + '.php?action=' + action;

    //     const updatedRes = await this.uploadDeleteImageFromServer(
    //         url,
    //         formData
    //     );

    //     return updatedRes;
    // }

    // async uploadDeleteImageFromServer(url: any, formData: any): Promise<any> {
    //     try {
    //         const postRes: any = await this.http
    //             .post(url, formData)
    //             .toPromise();

    //         console.log('Request URL ==> ', url);
    //         console.log('Response at Http ==> ', postRes);
    //         return postRes;
    //     } catch (error) {
    //         console.error(error);
    //         console.error(error.status);
    //         console.error(error.error); // Error message as string
    //         console.error(error.headers);
    //     }
    // }
}
