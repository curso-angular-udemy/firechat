import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interfaces/mensaje.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats: Array<Mensaje> = [];
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      console.log('Estado del usuario', user);
      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                                           .limit(5));
    return this.itemsCollection.valueChanges()
    .pipe(map(
      (mensajes: Array<Mensaje>) => {
        this.chats = mensajes.reverse();
        console.log(mensajes);
      },
      error => console.error(error)
    ));
  }

  login(proveedor: string) {
    switch (proveedor) {
      case 'google':
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        break;
      case 'twitter':
        this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
        break;
      case 'facebook':
        this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
        break;
    }
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  agregarMensaje(texto: string) {
    const mensaje: Mensaje =  {
      nombre: this.usuario.nombre,
      mensaje: texto,
      uid: this.usuario.uid,
      fecha: new Date().getTime()
    };

    return this.itemsCollection.add(mensaje);
  }
}
