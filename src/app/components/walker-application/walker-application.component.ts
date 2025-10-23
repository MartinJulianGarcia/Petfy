import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-walker-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './walker-application.component.html',
  styleUrls: ['./walker-application.component.css']
})
export class WalkerApplicationComponent implements OnInit {
  applicationForm = {
    documentImage: null as File | null,
    phone: '',
    description: ''
  };

  selectedFileName = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.applicationForm.documentImage = file;
      this.selectedFileName = file.name;
    }
  }

  submitApplication(): void {
    // Validar que todos los campos estén completos
    if (!this.applicationForm.documentImage) {
      alert('Por favor sube una imagen de tu documento');
      return;
    }

    if (!this.applicationForm.phone.trim()) {
      alert('Por favor ingresa tu número de teléfono');
      return;
    }

    if (!this.applicationForm.description.trim()) {
      alert('Por favor ingresa una descripción sobre ti');
      return;
    }

    // Aquí se podría enviar la solicitud a un backend
    // Por ahora solo mostramos un mensaje de confirmación
    alert('¡Solicitud enviada exitosamente! Te contactaremos pronto para evaluar tu aplicación.');
    
    // Redirigir al perfil
    this.router.navigate(['/profile']);
  }
}
