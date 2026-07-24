import { Injectable, computed, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = 'berinha:pwa-install-dismissed-at';
const DISMISS_DAYS = 14;

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  const ua = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|opios/i.test(ua);
  return isIos && isSafari;
}

function wasDismissedRecently(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  const dismissedAt = raw ? Number(raw) : NaN;
  if (Number.isNaN(dismissedAt)) return false;
  const elapsedDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return elapsedDays < DISMISS_DAYS;
}

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private readonly deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);
  private readonly dismissed = signal(wasDismissedRecently());
  private readonly installed = signal(isStandalone());

  /** Safari/iOS never fires beforeinstallprompt, so it needs manual "Adicionar à Tela de Início" instructions. */
  readonly isIos = isIosSafari();

  readonly canShowBanner = computed(
    () => !this.installed() && !this.dismissed() && (this.deferredPrompt() !== null || this.isIos),
  );

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt.set(event as BeforeInstallPromptEvent);
    });

    window.addEventListener('appinstalled', () => {
      this.installed.set(true);
      this.deferredPrompt.set(null);
    });
  }

  async promptInstall(): Promise<void> {
    const event = this.deferredPrompt();
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    this.deferredPrompt.set(null);
  }

  dismiss(): void {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    this.dismissed.set(true);
  }
}
