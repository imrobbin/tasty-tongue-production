import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { LoadingService } from 'src/app/services/loading.service';
import { AddressService } from 'src/app/services/address.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    // to get the data from parent component
    @Input() public componentData: any;

    public addressForm: FormGroup;

    constructor(
        private modalCtrl: ModalController,
        private loadingService: LoadingService,
        private addressService: AddressService
    ) {}

    ngOnInit() {
        console.log('componentData ', this.componentData);
        if (this.componentData.openView === 'add-address') {
            // fields for add address form
            this.addressForm = new FormGroup({
                address: new FormControl('', {
                    updateOn: 'change',
                    validators: [Validators.required],
                }),
                contact: new FormControl('', {
                    updateOn: 'change',
                    validators: [
                        Validators.required,
                        Validators.pattern('[0-9]*'),
                    ],
                }),
            });

            if (this.componentData.action === 'change') {
                this.addressForm.patchValue({
                    address: this.componentData.addressData.address,
                    contact: this.componentData.addressData.contact,
                });
            }
        }
    }

    async onAddAddress(addressForm: FormGroup): Promise<void> {
        await this.loadingService.showLoading('Adding address.');
        try {
            console.log(addressForm.value);

            const addressData = {
                address: addressForm.value.address,
                contact: addressForm.value.contact,
            };

            await this.addressService.addAddress(addressData);
            this.loadingService.showMessage('Address Added.', 'success');
            await this.modalCtrl.dismiss(null, 'cancel');
        } catch (error) {
            console.log('Error on ', error);
        }
        await this.loadingService.hideLoading();
    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }
}
