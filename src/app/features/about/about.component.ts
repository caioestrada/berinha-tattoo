import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlaceholderImageComponent } from '../../shared/ui/placeholder-image/placeholder-image.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, PlaceholderImageComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly specialties = ['Realismo', 'Retratos', 'Animais', 'Preto e cinza'];
}
