const IN_APP_BROWSER_PATTERNS = [/KAKAOTALK/i, /Instagram/i, /FBAN/i, /FBAV/i, /Line/i, /NAVER/i, /wv/i];

export const isInAppBrowser = (userAgent = navigator.userAgent) =>
  IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(userAgent));
