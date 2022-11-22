import { StorageService } from 'src/app/services/storage.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map, take, tap, catchError, shareReplay } from 'rxjs/operators';

export interface Product {
    id?: string;
    owner?: string;
    isAdmin?: boolean;
    title: string;
    summary: string;
    thumbnailURL: string;
    bannerURL: string;
    price: number;
    availability?: [];
    quantity?: number;
    amount?: number;
    isExpanded?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    // ref to the product collection in firestore
    private productsCollection: AngularFirestoreCollection<Product>;

    private products: Observable<Product[]>;
    public productSubject = new BehaviorSubject<any>(this.products);

    constructor(
        private afs: AngularFirestore,
        private storageService: StorageService
    ) {
        this.productsCollection = this.afs.collection<Product>('products');

        // this.products = this.productsCollection.valueChanges().pipe(
        //     tap((data) => {
        //         console.log('Products Data ======== ', data);
        //     }),
        //     map((products) => {
        //         this.storageService.setObject('products', products);
        //         return products.map((product) => {
        //             return {
        //                 ...product,
        //             } as Product;
        //         });
        //     }),
        //     shareReplay(1),
        //     catchError(this.handleError)
        // );

        // this.productSubject.next(this.products);
    }

    // used in cart service and products for admin
    getAllProducts(): Observable<Product[]> {
        this.products = this.productsCollection.valueChanges().pipe(
            tap((products) => console.log('Get All Products ===== ', products)),
            map((products) => {
                this.storageService.setObject('products', products);
                return products.map((product) => {
                    return { ...product } as Product;
                });
            }),
            shareReplay(1),
            catchError(this.handleError)
        );

        this.productSubject.next(this.products);
        return this.products;
    }

    // used for users product menu
    getProductsList() {
        return new Promise<any>((resolve, reject) => {
            return this.productsCollection.snapshotChanges().subscribe(
                (products) => {
                    const productsList = products.map((p) => {
                        const data = p.payload.doc.data();
                        data.isExpanded = false;
                        return { ...data };
                    });
                    resolve(productsList);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    addProduct(productData: any) {
        productData.id = this.afs.createId();

        return new Promise<any>((resolve, reject) => {
            this.productsCollection
                .doc(productData.id)
                .set(productData)
                .then(
                    (res) => resolve(res),
                    (err) => reject(err)
                );
        });
    }

    getProductById(productId: string): Observable<any> {
        return this.productsCollection
            .doc(productId)
            .snapshotChanges()
            .pipe(
                take(1),
                map((product) => {
                    return product;
                })
            );
    }

    updateProduct(productData: Product): Promise<void> {
        return this.productsCollection
            .doc(productData.id)
            .set(productData, { merge: true });
    }

    deleteProduct(product: any) {}

    private handleError(err: any) {
        console.error(err);
        let errorMsg: string;
        if (err.error instanceof ErrorEvent) {
            errorMsg = `An error occurred: ${err.error.message}`;
        } else {
            errorMsg = `Backend returned code ${err.status} : ${err.body.error}`;
        }
        console.log(err);
        return throwError(errorMsg);
    }
}
