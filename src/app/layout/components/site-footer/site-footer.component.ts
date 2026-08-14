import { ChangeDetectionStrategy, Component } from '@angular/core';

interface FooterSocialLink {
  icon: string;
  url: string;
  labelKey: string;
}

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();

  // Placeholder URLs — no public "store social links" endpoint exists in the API contract
  // yet (mirrors the contactPhone/contactEmail placeholder this replaced); swap for the
  // real profile URLs once one does.
  readonly socialLinks: FooterSocialLink[] = [
    { icon: 'pi-facebook', url: '#', labelKey: 'footer.social.facebook' },
    { icon: 'pi-instagram', url: '#', labelKey: 'footer.social.instagram' },
    { icon: 'pi-tiktok', url: '#', labelKey: 'footer.social.tiktok' }
  ];
}
