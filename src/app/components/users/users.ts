import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/models';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  @Input() users: User[] = [];
  @Input() loading = false;
  @Input() currentUserId = '';
  @Output() toggleRole = new EventEmitter<User>();

  onToggleRole(user: User) {
    this.toggleRole.emit(user);
  }
}
