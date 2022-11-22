import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

export interface Address {
    address: string;
    contact: number;
}

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    public address: Observable<Address>;
    public addressSubject = new BehaviorSubject<any>(this.address);
    private addressCollection: AngularFirestoreCollection<Address>;

    constructor(
        private afs: AngularFirestore,
        private storageService: StorageService
    ) {
        this.addressCollection = this.afs.collection<Address>('addresses');
    }

    getUsersAddress(owner: any): Observable<Address> {
        this.address = this.addressCollection
            .doc<Address>(owner)
            .valueChanges()
            .pipe(
                tap((address) => console.log('user address ===== ', address)),
                map((address) => {
                    const addressData = address as Address;
                    return addressData;
                }),
                shareReplay(1),
                catchError(this.handleError)
            );

        this.addressSubject.next(this.address);
        return this.address;
    }

    async addAddress(addressData: any): Promise<any> {
        const userData = await this.storageService.getObject('user');

        return new Promise<any>((resolve, reject) => {
            this.addressCollection
                .doc(userData.owner)
                .set(addressData)
                .then(
                    (res) => resolve(res),
                    (err) => reject(err)
                );
        });
    }

    private handleError(err: any) {
        console.log(err);
        let errorMsg: string;
        if (err.error instanceof ErrorEvent) {
            errorMsg = `An error occurred: ${err.error.message}`;
        } else {
            errorMsg = `Backend returned code ${err.status} : ${err.body.error}`;
        }

        return throwError(errorMsg);
    }
}
