import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

export interface User {
    owner: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    isAdmin: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private usersList: User[];
    private usersCollection: AngularFirestoreCollection<User>;

    constructor(private afStore: AngularFirestore) {
        this.usersCollection = this.afStore.collection<User>('users');
    }

    getUsersList() {
        return new Promise<any>((resolve, reject) => {
            return this.usersCollection.snapshotChanges().subscribe(
                (users) => {
                    this.usersList = users.map((u) => {
                        return u.payload.doc.data();
                    });
                    resolve(this.usersList);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    getUserById(ownerId: string) {
        return new Promise((resolve, reject) => {
            return this.usersCollection
                .doc<User>(ownerId)
                .snapshotChanges()
                .subscribe((user) => {
                    const u = user.payload.data();
                    resolve(u);
                });
        });
    }

    async addUser(userData: User): Promise<void> {
        // only this email is always set as admin
        if (userData.email === 'tastytongue.res@gmail.com') {
            userData.isAdmin = true;
        }
        const result = await this.usersCollection
            .doc(userData.owner)
            .set(userData);
        return result;
    }

    updateUser(userData: User): Promise<void> {
        if (userData.email === 'tastytongue.res@gmail.com') {
            userData.isAdmin = true;
        }
        return this.usersCollection
            .doc(userData.owner)
            .set(userData, { merge: true });
    }
}
