import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que le dice a Angular cómo luce un "Partido"
// Debe coincidir con los campos del backend
export interface Match {
  id: number;
  apiMatchId: number;
  leagueName: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchDate: string;
  status: string;
  homeGoals?: number;
  awayGoals?: number;
}

@Injectable({
  providedIn: 'root',
})

export class MatchService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getMatchesByLeague(code: string): Observable<Match[]> {  // Método para obtener el fixture por código de liga (ej: 'PL')
    return this.http.get<Match[]>(`${this.API_URL}/fixture/${code}`);
  }

  getAvaibleLeagues(): Observable<any> { // Trae las ligas disponibles en la API con el el plan FREE
    return this.http.get<any>(`${this.API_URL}/competitions`);
  }

}
