import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService, Match } from '../../services/match';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fixture-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixture.html',
  styleUrl: './fixture.css',
})

export class FixtureComponent implements OnInit {

  partidos: Match[] = [];

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const code = params['leagueCode']; // Obtenemos el código de la liga desde la URL
      if (code) {
        this.cargarPartidos(code);
      }
    })
  }

  cargarPartidos(codigo: string): void {
    this.matchService.getMatchesByLeague(codigo).subscribe({
      next: (data) => {
        this.partidos = data;
        console.log('✅ Partidos recibidos en el Frontend:', this.partidos);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al traer partidos:', err);
      }
    });
  }

}