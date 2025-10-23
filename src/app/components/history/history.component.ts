import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface WalkHistory {
  id: number;
  date: string;
  time: string;
  walker: string;
  status: 'finalized';
  address: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  finalizedWalks: WalkHistory[] = [];
  filteredWalks: WalkHistory[] = [];
  selectedWalk: WalkHistory | null = null;
  
  // Filtros
  startDate = '';
  endDate = '';
  
  // Estado de calificación
  showRatingModal = false;
  ratingType: 'app' | 'walk' = 'app';
  currentRating = 0;
  ratingHover = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadFinalizedWalks();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  loadFinalizedWalks(): void {
    // Cargar paseos finalizados desde localStorage
    const allRequests = JSON.parse(localStorage.getItem('walkRequests') || '[]');
    // Por ahora, no mostrar ningún paseo hasta que se implemente un sistema real de finalización
    // Solo mostrar paseos que tengan un campo 'isCompleted' como true
    this.finalizedWalks = allRequests.filter((request: any) => request.isCompleted === true);
    this.filteredWalks = [...this.finalizedWalks];
  }

  filterWalks(): void {
    if (!this.startDate && !this.endDate) {
      this.filteredWalks = [...this.finalizedWalks];
      return;
    }

    this.filteredWalks = this.finalizedWalks.filter(walk => {
      const walkDate = new Date(walk.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      if (start && end) {
        return walkDate >= start && walkDate <= end;
      } else if (start) {
        return walkDate >= start;
      } else if (end) {
        return walkDate <= end;
      }
      return true;
    });
  }

  selectWalk(walk: WalkHistory): void {
    this.selectedWalk = walk;
  }

  selectRating(walk: WalkHistory): void {
    this.selectedWalk = walk;
    this.ratingType = 'walk';
    this.showRatingModal = true;
    this.currentRating = 0;
  }

  rateApp(): void {
    this.ratingType = 'app';
    this.showRatingModal = true;
    this.currentRating = 0;
  }

  setRating(rating: number): void {
    this.currentRating = rating;
  }

  hoverRating(rating: number): void {
    this.ratingHover = rating;
  }

  clearHover(): void {
    this.ratingHover = 0;
  }

  submitRating(): void {
    if (this.currentRating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    if (this.ratingType === 'app') {
      alert(`¡Gracias por calificar nuestra app con ${this.currentRating} estrella${this.currentRating > 1 ? 's' : ''}!`);
    } else {
      alert(`¡Gracias por calificar el paseo con ${this.currentRating} estrella${this.currentRating > 1 ? 's' : ''}!`);
    }

    this.showRatingModal = false;
    this.currentRating = 0;
    this.ratingHover = 0;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.currentRating = 0;
    this.ratingHover = 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }
}
