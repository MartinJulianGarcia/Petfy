import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  email: string;
  password: string;
  role?: 'customer' | 'walker';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si hay un usuario logueado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Validar formato de email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar que el email tenga más de 2 caracteres en el dominio y usuario
  private validateEmailFormat(email: string): boolean {
    if (!this.isValidEmail(email)) {
      return false;
    }
    
    const [username, domain] = email.split('@');
    const [domainName, extension] = domain.split('.');
    
    return username.length > 2 && domainName.length > 2 && extension.length > 0;
  }

  // Validar username
  private validateUsername(username: string): boolean {
    const trimmedUsername = username.trim();
    return trimmedUsername.length >= 3 && trimmedUsername.length <= 20;
  }

  // Validar contraseñas
  private validatePasswords(password: string, confirmPassword: string): boolean {
    return password === confirmPassword && password.length > 0;
  }

  // Registrar nuevo usuario
  register(userData: User & { confirmPassword: string }): { success: boolean; message: string; user?: User } {
    // Validar username
    if (!this.validateUsername(userData.username)) {
      return {
        success: false,
        message: 'El nombre de usuario debe tener entre 3 y 20 caracteres'
      };
    }

    // Validar email
    if (!this.validateEmailFormat(userData.email)) {
      return {
        success: false,
        message: 'El email debe tener un formato válido con más de 2 caracteres en usuario y dominio'
      };
    }

    // Validar contraseñas
    if (!this.validatePasswords(userData.password, userData.confirmPassword)) {
      return {
        success: false,
        message: 'Las contraseñas no coinciden'
      };
    }

    // Verificar si el usuario ya existe
    const existingUsers = this.getStoredUsers();
    const userExists = existingUsers.some(user => 
      user.email === userData.email || user.username === userData.username
    );

    if (userExists) {
      return {
        success: false,
        message: 'Ya existe un usuario con este email o nombre de usuario'
      };
    }

    // Crear nuevo usuario
    const newUser: User = {
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      role: 'customer' // Por defecto todos son clientes
    };

    // Guardar usuario
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Iniciar sesión automáticamente después del registro
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: newUser
    };
  }

  // Iniciar sesión
  login(credentials: LoginCredentials): { success: boolean; message: string; user?: User } {
    const users = this.getStoredUsers();
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        message: 'Email o contraseña incorrectos'
      };
    }

    // Guardar usuario actual
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: user
    };
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Obtener usuarios almacenados
  private getStoredUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar si hay usuario logueado
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Cambiar rol del usuario a walker
  setWalkerRole(): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Actualizar rol en el array de usuarios
    const users = this.getStoredUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex].role = 'walker';
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Actualizar usuario actual
    currentUser.role = 'walker';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUserSubject.next(currentUser);

    return true;
  }

  // Verificar si el usuario es paseador
  isWalker(): boolean {
    return this.getCurrentUser()?.role === 'walker';
  }
}

