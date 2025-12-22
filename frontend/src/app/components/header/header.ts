import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Icono de hamburguesa
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Icono de perfil de usuario

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule], 
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class HeaderComponent {
  iconoHamburguesa = faBars;
  iconoUserProfile = faUser; 

  isMenuOpen = false;
  isUserProfileOpen = false;
  toggleHamburguer() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserProfile() {
    this.isUserProfileOpen = !this.isUserProfileOpen;
  }

}