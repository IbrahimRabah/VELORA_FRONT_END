import { isPlatformBrowser } from '@angular/common';

/**
 * Triggers a browser download for a Blob response (e.g. invoice/export PDFs, .xlsx
 * exports). Not a service — callers already have their own injected PLATFORM_ID, so it's
 * passed in rather than re-injected here. No-op outside the browser (SSR never has a
 * document to append an <a> to).
 */
export function downloadBlob(blob: Blob, filename: string, platformId: object): void {
  if (!isPlatformBrowser(platformId)) {
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
