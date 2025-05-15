import { APP_NAME, APP_TAGLINE } from "./config";

/**
 * Sets the document title with the application name
 * @param pageTitle Optional page title to add before the app name
 */
export function setDocumentTitle(pageTitle?: string): void {
  if (pageTitle) {
    document.title = `${pageTitle} | ${APP_NAME}`;
  } else {
    document.title = `${APP_NAME} - ${APP_TAGLINE}`;
  }
}

/**
 * Sets the document meta description
 * @param description The description to set
 */
export function setDocumentDescription(description: string): void {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
}
