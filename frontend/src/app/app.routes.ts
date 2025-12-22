import { Routes } from '@angular/router';
import { FixtureComponent } from './components/fixture/fixture'; 
import { LigaComponent } from './components/liga/liga';

export const routes: Routes = [

    // Por defecto va a las ligas
    {path: '', component: LigaComponent},
    {path: 'home', component: LigaComponent},
    // Ruta para ver los partidos de una liga basandose en su codigo
    {path: 'fixture/:leagueCode', component: FixtureComponent},
    // Redirigir cualquier error a las ligas
    { path: '**', redirectTo: '' } 
];
