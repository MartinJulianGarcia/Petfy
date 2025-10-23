import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface WalkRequest {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  walker: string;
  status: 'pending' | 'confirmed';
}

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  pendingRequests: WalkRequest[] = [];
  confirmedRequests: WalkRequest[] = [];
  selectedRequest: WalkRequest | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    const allRequests = JSON.parse(localStorage.getItem('walkRequests') || '[]');
    this.pendingRequests = allRequests.filter((req: WalkRequest) => req.status === 'pending');
    this.confirmedRequests = allRequests.filter((req: WalkRequest) => req.status === 'confirmed');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  selectRequest(request: WalkRequest) {
    this.selectedRequest = request;
  }

  modifyRequest() {
    if (this.selectedRequest) {
      // Navegar a la página de solicitud con parámetros de edición
      this.router.navigate(['/request'], {
        queryParams: { edit: 'true', id: this.selectedRequest.id }
      });
    } else {
      alert('Por favor selecciona una solicitud');
    }
  }

  cancelRequest() {
    if (this.selectedRequest) {
      if (confirm(`¿Estás seguro de que quieres cancelar la solicitud del ${this.selectedRequest.date}?`)) {
        const allRequests = JSON.parse(localStorage.getItem('walkRequests') || '[]');
        const updatedRequests = allRequests.filter((req: WalkRequest) => req.id !== this.selectedRequest!.id);
        localStorage.setItem('walkRequests', JSON.stringify(updatedRequests));
        
        this.loadRequests();
        this.selectedRequest = null;
        alert('Solicitud cancelada exitosamente');
      }
    } else {
      alert('Por favor selecciona una solicitud');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    return `${day}/${month}, ${hours}hs`;
  }
}
