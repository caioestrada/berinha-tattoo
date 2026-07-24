import { Component, inject } from '@angular/core';
import { PwaInstallService } from '../../pwa-install/pwa-install.service';

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  templateUrl: './pwa-install-banner.component.html',
  styleUrl: './pwa-install-banner.component.scss',
})
export class PwaInstallBannerComponent {
  protected readonly pwaInstall = inject(PwaInstallService);

  install(): void {
    void this.pwaInstall.promptInstall();
  }

  dismiss(): void {
    this.pwaInstall.dismiss();
  }
}
