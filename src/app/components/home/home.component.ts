import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está logueado
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      // Si no hay usuario logueado, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  // Ir al perfil del usuario
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Solicitar paseo
  goToVeterinaries(): void {
    this.router.navigate(['/request']);
  }

  // Ver mis solicitudes
  createEmergencyRequest(): void {
    this.router.navigate(['/requests']);
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

