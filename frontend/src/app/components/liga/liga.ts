import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchService } from '../../services/match'; 

@Component({
  selector: 'liga-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './liga.html',
  styleUrl: './liga.css',
})

export class LigaComponent implements OnInit{
  ligas: any[] = [];
  loading = true;

  // Ligas disponibles con el plan FREE
  ligasPermitidas = ['PL', 'PD', 'BL1', 'SA', 'CL', 'DED', 'ELC', 'WC', 'BSA', 'PPL', 'EC', 'FL1'];

  constructor(
    private matchService: MatchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.matchService.getAvaibleLeagues().subscribe({
      next: (response) => {
        console.log("Ligas recibidas:", response);
        this.ligas = response.competitions.filter((c: any) => 
          this.ligasPermitidas.includes(c.code)
        );
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.log('Error al cargar las ligas', err);
        this.loading = false;
      }
    })
  }
}
