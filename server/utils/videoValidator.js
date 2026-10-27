/**
 * Provider-Specific Video URL Validation and Safe Embed Generator
 * Never accepts raw iframe HTML strings to prevent XSS.
 * Extracts canonical IDs and constructs safe sandboxed embed URLs.
 */

const extractYouTubeId = (url) => {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  return null;
};

const extractVimeoId = (url) => {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/i);
  if (match) return match[1];
  if (/^\d{6,12}$/.test(clean)) return clean;
  return null;
};

const extractWistiaId = (url) => {
  if (!url) return null;
  const clean = url.trim();
  // Match fast.wistia.net/embed/iframe/{id}, wistia.com/medias/{id}, fast.wistia.com/embed/iframe/{id}, wi.st/{id}
  const match = clean.match(
    /(?:(?:fast\.)?wistia\.(?:net|com)\/(?:embed\/iframe\/|embed\/playlists\/|embed\/|medias\/)|wi\.st\/)([\w-]+)/i
  );
  if (match) return match[1];

  // Match raw Wistia alphanumeric ID
  if (/^[a-zA-Z0-9_-]{8,15}$/.test(clean)) {
    return clean;
  }

  // Fallback: any wistia URL ending in an ID
  const fallback = clean.match(/(?:wistia\.(?:net|com).*\/)([\w-]+)(?:\?.*)?$/i);
  return fallback ? fallback[1] : null;
};

const extractGoogleDriveId = (url) => {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/i);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(clean)) return clean;
  return null;
};

const validateAndFormatVideo = (url, type) => {
  if (!type || type === 'none') {
    return { isValid: true, embedUrl: '', provider: 'none', id: null };
  }

  if (!url || typeof url !== 'string' || !url.trim()) {
    return { isValid: false, error: 'Video URL is required when video type is not "none"' };
  }

  const cleanUrl = url.trim();

  // Guard against arbitrary HTML or script injection
  if (/<[a-z][\s\S]*>/i.test(cleanUrl) || cleanUrl.toLowerCase().includes('<iframe')) {
    return { isValid: false, error: 'Raw HTML and iframe tags are strictly disallowed for security reasons. Provide the canonical media URL.' };
  }

  switch (type) {
    case 'youtube': {
      const id = extractYouTubeId(cleanUrl);
      if (!id) {
        return { isValid: false, error: 'Invalid YouTube URL. Please provide a standard YouTube video link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)' };
      }
      return {
        isValid: true,
        provider: 'youtube',
        id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      };
    }

    case 'vimeo': {
      const id = extractVimeoId(cleanUrl);
      if (!id) {
        return { isValid: false, error: 'Invalid Vimeo URL. Expected format: https://vimeo.com/{videoId}' };
      }
      return {
        isValid: true,
        provider: 'vimeo',
        id,
        embedUrl: `https://player.vimeo.com/video/${id}?dnt=1`,
      };
    }

    case 'wistia': {
      const id = extractWistiaId(cleanUrl);
      if (!id) {
        return { isValid: false, error: 'Invalid Wistia URL. Expected format: https://fast.wistia.net/embed/iframe/{id} or https://home.wistia.com/medias/{id}' };
      }
      return {
        isValid: true,
        provider: 'wistia',
        id,
        embedUrl: `https://fast.wistia.net/embed/iframe/${id}`,
      };
    }

    case 'drive': {
      const id = extractGoogleDriveId(cleanUrl);
      if (!id) {
        return { isValid: false, error: 'Invalid Google Drive video URL. Expected format: https://drive.google.com/file/d/{fileId}/view' };
      }
      return {
        isValid: true,
        provider: 'drive',
        id,
        embedUrl: `https://drive.google.com/file/d/${id}/preview`,
        notice: 'Ensure file permission in Google Drive is set to "Anyone with the link can view".',
      };
    }

    case 'external': {
      try {
        const parsed = new URL(cleanUrl);
        if (parsed.protocol !== 'https:') {
          return { isValid: false, error: 'External embed URLs must strictly use secure HTTPS protocol' };
        }
        return {
          isValid: true,
          provider: 'external',
          id: cleanUrl,
          embedUrl: cleanUrl,
        };
      } catch (e) {
        return { isValid: false, error: 'Invalid URL format for external embed' };
      }
    }

    default:
      return { isValid: false, error: `Unsupported video type: ${type}` };
  }
};

module.exports = {
  validateAndFormatVideo,
  extractYouTubeId,
  extractVimeoId,
  extractWistiaId,
  extractGoogleDriveId,
};
