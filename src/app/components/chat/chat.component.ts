import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje = '';
  elemento: any;

  constructor( public _cs: ChatService) {
    this._cs.cargarMensajes()
    .subscribe(() => {
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;  // Hace que el scroll se mueva al final
      }, 100);
    });
  }

  ngOnInit () {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje() {
    if (this.mensaje.length === 0) {
      return;
    }

    this._cs.agregarMensaje(this.mensaje)
      .then( () => this.mensaje = '')
      .catch( (err) => console.error('No se pudo enviar el mensaje', err));

    }
}
