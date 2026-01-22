import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService, Match } from '../../services/match';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'fixture-component',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './fixture.html',
  styleUrl: './fixture.css',
})

export class FixtureComponent implements OnInit {

  matches: Match[] = [];
  selectedDate: Date = new Date();
  todayDate: Date = new Date();
  leagueCode: string = '';

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.todayDate.setHours(0, 0, 0, 0);
    this.selectedDate = new Date(this.todayDate);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leagueCode = params['leagueCode'];
      if (this.leagueCode) {
        this.loadGames(this.leagueCode, this.selectedDate);
      }
    })
  }

  loadGames(code: string, date: Date): void {
    const formatedDate = date.toISOString().split('T')[0];
    this.matchService.getMatchesByLeagueAndDate(code, formatedDate).subscribe({
      next: (data) => {
        this.matches = data;
        console.log(`✅ Partidos recibidos para ${formatedDate}:`, this.matches);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al traer partidos:', err);
      }
    });
  }

  previousDay(): void { // New date of the previus day.
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.loadGames(this.leagueCode, this.selectedDate);
  }

  nextDay(): void { // New date of the next day.
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.loadGames(this.leagueCode, this.selectedDate);
  }

  isToday(): boolean { // Check if the selected date is today
    const selected = new Date(this.selectedDate);
    selected.setHours(0, 0, 0, 0);
    const today = new Date(this.todayDate);
    today.setHours(0, 0, 0, 0);
    return selected.getTime() === this.todayDate.getTime();
  }

  isMatchFinished(game: Match): boolean {
    return game.status === 'FINISHED';
  }

  isMatchLive(game: Match): boolean {
    return game.status === 'IN GAME';
  }

}