import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyGallery } from '../property-gallery/property-gallery';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, PropertyGallery],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  features = [
    {
      icon: '🌞',
      title: 'Soligt läge',
      description: 'Njut av det vackra spanska solskenet året runt'
    },
    {
      icon: '🏡',
      title: 'Rymligt & Bekvämt',
      description: 'Moderna bekvmligheter med traditionell spansk charm'
    },
    {
      icon: '📍',
      title: 'Toppenläge',
      description: 'Nära lokala attraktioner och bekvämligheter'
    },
    {
      icon: '⭐',
      title: 'Högt Betyg',
      description: 'Älskad av gäster från hela världen'
    }
  ];
}
