import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-client-shell',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './client-shell.component.html',
  styleUrl: './client-shell.component.scss',
})
export class ClientShellComponent {}
