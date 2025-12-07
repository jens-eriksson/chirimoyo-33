import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-gallery',
  imports: [CommonModule],
  templateUrl: './property-gallery.html',
  styleUrl: './property-gallery.scss'
})
export class PropertyGallery implements OnInit {
  images: string[] = [];
  selectedImage: string = '';
  currentIndex: number = 0;

  propertyInfo = {
    title: 'Chirimoyo 33 - Your Spanish Getaway',
    description: 'Experience the charm of Spanish living in our beautiful vacation home. Perfect for families and groups looking for a memorable stay in a serene environment.',
    amenities: [
      { icon: '🏠', name: 'Spacious Living Area' },
      { icon: '🛏️', name: 'Comfortable Bedrooms' },
      { icon: '🍳', name: 'Fully Equipped Kitchen' },
      { icon: '🌞', name: 'Sunny Terrace' },
      { icon: '📶', name: 'High-Speed WiFi' },
      { icon: '🅿️', name: 'Free Parking' },
      { icon: '❄️', name: 'Air Conditioning' },
      { icon: '🔥', name: 'Heating' }
    ]
  };

  ngOnInit() {
    // Load all property images from the public folder
    const imageCount = 90; // We have 90 images
    const imageNames = [ 'fafbd307-3c72-483f-bf2f-7238d9688c95.png',
      'IMG_1259.png', 'IMG_1260.png', 'IMG_1261.png', 'IMG_1262.png', 'IMG_1263.png',
      'IMG_1264.png', 'IMG_1265.png', 'IMG_1266.png', 'IMG_1267.png', 'IMG_1268.png',
      'IMG_1277.png', 'IMG_1278.png', 'IMG_1279.png', 'IMG_1280.png', 'IMG_1281.png',
      'IMG_1283.png', 'IMG_1284.png', 'IMG_1285.png', 'IMG_1286.png', 'IMG_1287.png',
      'IMG_1288.png', 'IMG_1289.png', 'IMG_1290.png', 'IMG_1291.png', 'IMG_1292.png'
    ];
    
    this.images = imageNames.map(name => `/images/${name}`);
    this.selectedImage = this.images[0];
  }

  selectImage(image: string, index: number) {
    this.selectedImage = image;
    this.currentIndex = index;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.selectedImage = this.images[this.currentIndex];
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.selectedImage = this.images[this.currentIndex];
  }
}
