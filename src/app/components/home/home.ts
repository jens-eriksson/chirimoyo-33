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
      title: 'Sunny Location',
      description: 'Enjoy the beautiful Spanish sunshine year-round'
    },
    {
      icon: '🏡',
      title: 'Spacious & Comfortable',
      description: 'Modern amenities with traditional Spanish charm'
    },
    {
      icon: '📍',
      title: 'Prime Location',
      description: 'Close to local attractions and amenities'
    },
    {
      icon: '⭐',
      title: 'Highly Rated',
      description: 'Loved by guests from around the world'
    }
  ];
}
