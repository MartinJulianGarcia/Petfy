import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'walker';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  walkerName: string = '';
  messages: Message[] = [];
  newMessage: string = '';
  requestId: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el nombre del paseador y el ID de la solicitud desde los parámetros
    this.route.queryParams.subscribe(params => {
      this.walkerName = params['walker'] || 'Paseador';
      this.requestId = parseInt(params['requestId']) || null;
    });

    this.loadMessages();
  }

  loadMessages() {
    // Cargar mensajes existentes desde localStorage
    const chatKey = `chat_${this.requestId}_${this.walkerName}`;
    const savedMessages = localStorage.getItem(chatKey);
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } else {
      // Mensaje inicial del paseador
      this.messages = [{
        id: 1,
        text: `¡Hola! Soy ${this.walkerName}, tu paseador asignado. ¿Cómo está tu mascota?`,
        sender: 'walker',
        timestamp: new Date()
      }];
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        text: this.newMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      };

      this.messages.push(message);
      this.newMessage = '';
      this.saveMessages();

      // Simular respuesta del paseador después de un breve delay
      setTimeout(() => {
        this.simulateWalkerResponse();
      }, 2500);
    }
  }

  simulateWalkerResponse() {
    const responses = [
      'No hay inconveniente alguno.',
      'Perfecto, no hay problema.',
      'Entendido, sin problemas.',
      'No te preocupes, todo está bien.',
      'Perfecto, me parece bien.',
      'Entendido, todo bajo control.',
      '¡Perfecto! Todo listo.',
      'No hay inconveniente con eso.',
      'Perfecto, sin problemas.',
      'Entendido, no hay inconveniente.',
      '¡Genial! Todo está claro.',
      'Perfecto, todo bien.',
      'No hay problema alguno.',
      'Entendido, sin inconveniente.',
      '¡Perfecto! No hay inconveniente.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const walkerMessage: Message = {
      id: Date.now() + 1,
      text: randomResponse,
      sender: 'walker',
      timestamp: new Date()
    };

    this.messages.push(walkerMessage);
    this.saveMessages();
  }


  saveMessages() {
    const chatKey = `chat_${this.requestId}_${this.walkerName}`;
    localStorage.setItem(chatKey, JSON.stringify(this.messages));
  }

  goBack() {
    this.router.navigate(['/requests']);
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
