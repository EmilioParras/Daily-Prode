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
  leagues: any[] = [];
  loading = true;

  avaibleLeagues = ['PL', 'PD', 'BL1', 'SA', 'FL1', 'CL'];
  //avaibleLeagues = ['PL','PD', 'BL1', 'SA', 'CL', 'DED', 'ELC', 'WC', 'BSA', 'PPL', 'EC', 'FL1'];

  constructor(
    private matchService: MatchService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
  this.matchService.getAvaibleLeagues().subscribe({
    next: (response) => {
      this.leagues = response.competitions
        .filter((c: any) => this.avaibleLeagues.includes(c.code))
        .map((c: any) => ({ ...c, matchesCount: '...' }));

      this.loading = false;
      this.loadSecuentialLeagues();
    },
    error: (err) => {
      console.log('Error loading leagues. liga.ts', err);
      this.loading = false;
    }
  });
}

async loadSecuentialLeagues() {
  for (const league of this.leagues) {
    try {
      const data: any = await this.matchService.getMatchesByLeague(league.code).toPromise();
      league.matchesCount = Array.isArray(data) ? data.length : 0;
    } catch (err) {
      league.matchesCount = 0;
    }
    this.cdr.detectChanges();
  }
}
}
