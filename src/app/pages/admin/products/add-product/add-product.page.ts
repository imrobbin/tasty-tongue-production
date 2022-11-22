import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { CameraSource } from '@capacitor/core';

import { UserService, User } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService, Product } from 'src/app/services/product.service';
import { CameraService } from 'src/app/services/camera.service';
import { LoadingService } from 'src/app/services/loading.service';

import { EditImageComponent } from 'src/app/components/edit-image/edit-image.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.page.html',
    styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
    // to select file opener
    @ViewChild('fileInput') public fileInput: ElementRef;
    addProductForm: FormGroup;

    // default loader image
    public defaultImageBanner = environment.defaultImageBanner;
    public productsList: Product[];
    private product: Product;

    // on updating product new photo selected
    public onUpdateNewPhotoSelected = false;
    // on adding product check it is selected or not (used in DOM)
    public isPhotoSelected = false;
    // did form fields value changed on adding/updating
    public addProductFormDidChanged = false;
    // confirms updating the product (used in ts and DOM)
    public updatingProduct = false;

    public userData: User[];

    availabilityData = ['Morning', 'Evening'];

    constructor(
        public platform: Platform,
        private actvRoute: ActivatedRoute,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private cameraService: CameraService,
        private loadingService: LoadingService,
        private productService: ProductService,
        private authService: AuthService,
        private storageService: StorageService,
        private userService: UserService
    ) {}

    async ngOnInit() {
        this.addProductForm = new FormGroup({
            image: new FormControl('../../../../assets/images/sample.png', {
                updateOn: 'change',
                validators: [Validators.required],
            }),
            title: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required],
            }),
            summary: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required],
            }),
            price: new FormControl(null, {
                updateOn: 'change',
                validators: [Validators.required],
            }),
            availability: new FormControl([], {
                updateOn: 'change',
                validators: [Validators.required],
            }),
        });
    }

    async ionViewWillEnter() {
        this.productsList = await this.storageService.getObject('products');

        const productId = this.actvRoute.snapshot.paramMap.get('productId');

        if (productId && productId !== undefined) {
            this.product = this.productsList.find((p) => {
                return p.id === productId;
            });
            console.log(this.product);

            this.addProductForm.patchValue({
                image: this.product.bannerURL,
                title: this.product.title,
                summary: this.product.summary,
                price: this.product.price,
                availability: this.product.availability,
            });

            // updating an existing product
            this.updatingProduct = true;

            // check image is selected or not
            this.isPhotoSelected = true;
        }

        // is the form edited or not (change on valueChanges)
        this.addProductForm.valueChanges.subscribe((values) => {
            this.addProductFormDidChanged = true;
        });
    }

    async submitAddProductForm(addProductForm: FormGroup) {
        await this.loadingService.showLoading('Prepering upload.');
        try {
            if (!this.isPhotoSelected) {
                this.loadingService.showMessage(
                    'You must add a product photo',
                    'danger'
                );
                return;
            }
            console.log(addProductForm.value);

            let thumbImg = '';
            let bannerImg = '';
            // upload the selected image; if changed
            if (this.onUpdateNewPhotoSelected === true) {
                const imgUploadURL: any = await this.cameraService.uploadImage(
                    addProductForm.value.image
                );

                const img = imgUploadURL.split('.png');
                thumbImg = img[0] + '_180x180.png' + img[1];
                bannerImg = img[0] + '_1080x608.png' + img[1];
            } else {
                thumbImg = this.product.thumbnailURL;
                bannerImg = this.product.bannerURL;
            }

            await this.loadingService.hideLoading();
            await this.loadingService.showLoading('Saving Product.');

            const userData: any = await this.storageService.getObject('user');

            const productData: Product = {
                owner: userData.owner,
                isAdmin: userData.isAdmin,
                thumbnailURL: thumbImg,
                bannerURL: bannerImg,
                title: addProductForm.value.title,
                summary: addProductForm.value.summary,
                price: addProductForm.value.price,
                availability: addProductForm.value.availability,
                quantity: 0,
            };
            if (this.updatingProduct === true) {
                productData.id = this.product.id;
                await this.productService.updateProduct(productData);
                await this.loadingService.showMessage(
                    'Product Updated.',
                    'success'
                );
            } else {
                await this.productService.addProduct(productData);
                await this.loadingService.showMessage(
                    'Product Added.',
                    'success'
                );
            }
            this.addProductForm.reset();
            this.navCtrl.back();
        } catch (error) {
            console.log(error);
        }
        await this.loadingService.hideLoading();
    }

    async getCurrentUser() {
        try {
            // this.userData = await this.userService.getUsersList();
            // console.log(this.userData);

            const user: any = await this.storageService.getObject('user');
            const d = await this.userService.getUserById(user.owner);
            console.log(d);
        } catch (error) {
            console.log(error);
        }
    }

    public startTakingPhoto() {
        // Only allow file selection inside a browser
        if (!this.platform.is('hybrid')) {
            this.fileInput.nativeElement.click();
        } else {
            // open gallery in mobile
            this.openGalleryToChoosePhoto();
        }
    }

    // Used for browser direct file upload
    public async openImageFileSelector(event: EventTarget) {
        try {
            const eventObj: MSInputMethodContext = event as MSInputMethodContext;
            const target: HTMLInputElement = eventObj.target as HTMLInputElement;
            const file: File = target.files[0];

            const takePhotoRes: any = URL.createObjectURL(file);

            // show preview for taken image
            this.showImagePreviewToCrop(takePhotoRes);
        } catch (error) {
            console.log('Error openImageFileSelector', error);
            this.loadingService.showMessage('Action Cancelled', 'danger');
        }
    }

    // open gallery
    public async openGalleryToChoosePhoto() {
        try {
            const takePhotoRes = await this.cameraService.takePicture(
                CameraSource.Photos
            );

            // show preview for taken image
            this.showImagePreviewToCrop(takePhotoRes);
        } catch (error) {
            this.loadingService.showMessage('Action Cancelled', 'danger');
        }
    }

    public async showImagePreviewToCrop(imageToCrop: any) {
        this.modalCtrl
            .create({
                component: EditImageComponent,
                backdropDismiss: false,
                componentProps: {
                    userData: {
                        imageData: imageToCrop,
                        imageSource: 'add-photo',
                    },
                },
                presentingElement: await this.modalCtrl.getTop(),
            })
            .then((modalEl) => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(async (resultData) => {
                console.log(resultData.data, resultData.role);
                if (resultData.role === 'confirm') {
                    this.addProductForm.patchValue({
                        image: resultData.data.imageData,
                    });

                    this.isPhotoSelected = true;

                    // to confirm image is changed on update or add
                    this.onUpdateNewPhotoSelected = true;
                }
            });
    }
}
