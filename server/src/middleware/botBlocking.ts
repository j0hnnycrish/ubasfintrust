import { Request, Response, NextFunction } from 'express';
import { logger, logSecurity } from '@/utils/logger';

// Comprehensive list of bot user agents to block
const BLOCKED_BOTS = [
  // Search Engine Bots
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
  'sogou', 'exabot', 'facebot', 'ia_archiver', 'wayback', 'archive.org_bot',
  
  // Social Media Bots
  'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot',
  'discordbot', 'skypebot', 'slackbot', 'pinterestbot', 'redditbot',
  
  // SEO and Analytics Bots
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'blexbot', 'screaming frog',
  'seobilitybot', 'serpstatbot', 'linkdexbot', 'spbot', 'rogerbot',
  
  // AI and ML Bots
  'chatgpt-user', 'gptbot', 'claude-web', 'anthropic-ai', 'claude', 'bard',
  'openai', 'ccbot', 'chatgpt', 'gpt-3', 'gpt-4', 'palm', 'lamda',
  
  // Scraping and Crawling Bots
  'scrapy', 'beautifulsoup', 'python-requests', 'curl', 'wget', 'httpclient',
  'apache-httpclient', 'okhttp', 'node-fetch', 'axios', 'postman',
  
  // Security and Monitoring Bots
  'nmap', 'masscan', 'zmap', 'shodan', 'censys', 'binaryedge',
  'securitytrails', 'virustotal', 'urlvoid', 'hybrid-analysis',
  
  // Academic and Research Bots
  'researchscan', 'universityscan', 'academicbot', 'scholarbot',
  'citationbot', 'paperbot', 'researchgate', 'academia.edu',
  
  // Archive and Backup Bots
  'heritrix', 'nutch', 'commoncrawl', 'webarchive', 'archivebot',
  'backupbot', 'mirrorbot', 'cachebot', 'snapshotbot',
  
  // Generic Bot Patterns
  'bot', 'crawler', 'spider', 'scraper', 'fetcher', 'parser',
  'extractor', 'monitor', 'checker', 'validator', 'analyzer'
];

// Suspicious IP ranges (add more as needed)
const BLOCKED_IP_RANGES = [
  // Common VPN/Proxy ranges
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  // Add specific ranges of known bot farms
];

// Suspicious request patterns
const SUSPICIOUS_PATTERNS = [
  // Common bot request patterns
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/admin/i,
  /\/phpmyadmin/i,
  /\/xmlrpc\.php/i,
  /\/sitemap\.xml/i,
  /\/robots\.txt/i,
  /\.env$/i,
  /\.git/i,
  /\.svn/i,
  /\.htaccess/i,
  /\/api\/.*\/dump/i,
  /\/backup/i,
  /\/config/i,
  /\/database/i,
  /\/sql/i,
];

export const botBlockingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent')?.toLowerCase() || '';
  const ip = req.ip || req.connection.remoteAddress || '';
  const path = req.path.toLowerCase();
  const referer = req.get('Referer') || '';

  // Check for bot user agents
  const isBot = BLOCKED_BOTS.some(bot => userAgent.includes(bot.toLowerCase()));
  
  if (isBot) {
    logSecurity('BOT_BLOCKED_USER_AGENT', undefined, ip, {
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Automated access is not permitted'
    });
  }

  // Check for suspicious request patterns
  const isSuspiciousPath = SUSPICIOUS_PATTERNS.some(pattern => pattern.test(path));
  
  if (isSuspiciousPath) {
    logSecurity('SUSPICIOUS_PATH_BLOCKED', undefined, ip, {
      path: req.path,
      userAgent: req.get('User-Agent'),
      method: req.method
    });
    
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found'
    });
  }

  // Check for missing or suspicious user agent
  if (!userAgent || userAgent.length < 10) {
    logSecurity('SUSPICIOUS_USER_AGENT', undefined, ip, {
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Valid user agent required'
    });
  }

  // Check for rapid requests (basic rate limiting)
  const requestKey = `bot_check:${ip}`;
  // This would integrate with Redis for proper rate limiting
  
  // Check for headless browser indicators
  const headlessIndicators = [
    'headlesschrome',
    'phantomjs',
    'selenium',
    'webdriver',
    'puppeteer',
    'playwright',
    'chromedriver'
  ];
  
  const isHeadless = headlessIndicators.some(indicator => 
    userAgent.includes(indicator.toLowerCase())
  );
  
  if (isHeadless) {
    logSecurity('HEADLESS_BROWSER_BLOCKED', undefined, ip, {
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Automated browsers are not permitted'
    });
  }

  // Check for common scraping libraries
  const scrapingLibraries = [
    'python-requests',
    'urllib',
    'httplib',
    'mechanize',
    'beautifulsoup',
    'scrapy',
    'selenium',
    'phantomjs'
  ];
  
  const isScrapingLibrary = scrapingLibraries.some(lib => 
    userAgent.includes(lib.toLowerCase())
  );
  
  if (isScrapingLibrary) {
    logSecurity('SCRAPING_LIBRARY_BLOCKED', undefined, ip, {
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Automated tools are not permitted'
    });
  }

  // Add additional security headers to prevent indexing
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

// Middleware to add no-index headers to all responses
export const noIndexMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set comprehensive no-index headers
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noydir');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private, no-transform');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

// Advanced bot detection using behavioral analysis
export const advancedBotDetection = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const acceptHeader = req.get('Accept') || '';
  const acceptLanguage = req.get('Accept-Language') || '';
  const acceptEncoding = req.get('Accept-Encoding') || '';
  
  // Check for missing common browser headers
  const hasCommonHeaders = acceptHeader && acceptLanguage && acceptEncoding;
  
  if (!hasCommonHeaders) {
    logSecurity('MISSING_BROWSER_HEADERS', undefined, req.ip, {
      userAgent,
      accept: acceptHeader,
      acceptLanguage,
      acceptEncoding,
      path: req.path
    });
    
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Invalid request headers'
    });
  }
  
  // Check for suspicious header combinations
  if (acceptHeader === '*/*' && !acceptLanguage) {
    logSecurity('SUSPICIOUS_HEADER_COMBINATION', undefined, req.ip, {
      userAgent,
      headers: req.headers,
      path: req.path
    });
    
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Invalid request format'
    });
  }
  
  next();
};

export default {
  botBlockingMiddleware,
  noIndexMiddleware,
  advancedBotDetection
};
