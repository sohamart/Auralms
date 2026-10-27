/**
 * Resource Validation and URL Normalizer
 * Enforces safe links, validates schemas, and formats embed/preview URLs.
 */

const formatGoogleResourceUrl = (url, type) => {
  if (!url) return '';
  const cleanUrl = url.trim();

  // If it's a Google Drive file link
  const driveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return {
      originalUrl: cleanUrl,
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      fileId,
    };
  }

  // Google Docs
  if (cleanUrl.includes('docs.google.com/document/d/')) {
    const docIdMatch = cleanUrl.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    const docId = docIdMatch ? docIdMatch[1] : '';
    return {
      originalUrl: cleanUrl,
      previewUrl: docId ? `https://docs.google.com/document/d/${docId}/preview` : cleanUrl,
      docId,
    };
  }

  // Google Sheets
  if (cleanUrl.includes('docs.google.com/spreadsheets/d/')) {
    const sheetIdMatch = cleanUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    const sheetId = sheetIdMatch ? sheetIdMatch[1] : '';
    return {
      originalUrl: cleanUrl,
      previewUrl: sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/preview` : cleanUrl,
      sheetId,
    };
  }

  // Google Slides
  if (cleanUrl.includes('docs.google.com/presentation/d/')) {
    const slideIdMatch = cleanUrl.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    const slideId = slideIdMatch ? slideIdMatch[1] : '';
    return {
      originalUrl: cleanUrl,
      previewUrl: slideId ? `https://docs.google.com/presentation/d/${slideId}/preview` : cleanUrl,
      slideId,
    };
  }

  return {
    originalUrl: cleanUrl,
    previewUrl: cleanUrl,
  };
};

const validateResource = (res) => {
  if (!res || !res.title || !res.title.trim()) {
    return { isValid: false, error: 'Resource title is required' };
  }

  if (res.type !== 'note') {
    if (!res.url || !res.url.trim()) {
      return { isValid: false, error: `URL is required for resource: "${res.title}"` };
    }

    try {
      const parsed = new URL(res.url.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return { isValid: false, error: 'Resource URLs must be valid HTTP/HTTPS web links' };
      }
    } catch (e) {
      return { isValid: false, error: `Invalid URL format in resource: "${res.title}"` };
    }
  }

  return { isValid: true };
};

module.exports = {
  formatGoogleResourceUrl,
  validateResource,
};
