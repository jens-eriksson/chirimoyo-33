import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  
  user$ = user(this.auth);
  
  currentUser$: Observable<User | null> = this.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      return from(getDoc(userDoc)).pipe(
        map(docSnap => {
          if (docSnap.exists()) {
            return docSnap.data() as User;
          }
          return null;
        })
      );
    })
  );

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userDoc);
    
    let userData: User;
    if (!userSnap.exists()) {
      // New user - set as customer by default
      userData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'customer'
      };
      await setDoc(userDoc, userData);
    } else {
      userData = userSnap.data() as User;
    }
    
    return userData;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  async getUserRole(uid: string): Promise<'admin' | 'customer'> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return (userSnap.data() as User).role;
    }
    return 'customer';
  }
}
