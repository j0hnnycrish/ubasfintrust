// Client-side bot detection and protection
export class BotDetection {
  private static instance: BotDetection;
  private isBot: boolean = false;
  private detectionResults: string[] = [];

  private constructor() {
    this.runDetection();
  }

  public static getInstance(): BotDetection {
    if (!BotDetection.instance) {
      BotDetection.instance = new BotDetection();
    }
    return BotDetection.instance;
  }

  private runDetection(): void {
    // Check for headless browser indicators
    this.checkHeadlessBrowser();
    
    // Check for automation tools
    this.checkAutomationTools();
    
    // Check for missing browser features
    this.checkBrowserFeatures();
    
    // Check user agent
    this.checkUserAgent();
    
    // Check for webdriver
    this.checkWebDriver();
    
    // Check for phantom JS
    this.checkPhantomJS();
    
    // Check for selenium
    this.checkSelenium();
    
    // Check for unusual window properties
    this.checkWindowProperties();
    
    // Check for missing plugins
    this.checkPlugins();
    
    // Check for canvas fingerprinting
    this.checkCanvas();
    
    // If any detection method flags as bot, mark as bot
    this.isBot = this.detectionResults.length > 0;
    
    if (this.isBot) {
      this.blockAccess();
    }
  }

  private checkHeadlessBrowser(): void {
    // Check for headless Chrome
    if (navigator.webdriver) {
      this.detectionResults.push('WebDriver detected');
    }

    // Check for missing window.chrome in Chrome
    if (navigator.userAgent.includes('Chrome') && !window.chrome) {
      this.detectionResults.push('Headless Chrome detected');
    }

    // Check for phantom JS
    if (window.callPhantom || window._phantom) {
      this.detectionResults.push('PhantomJS detected');
    }
  }

  private checkAutomationTools(): void {
    // Check for Selenium
    if (window.document.documentElement.getAttribute('selenium') ||
        window.document.documentElement.getAttribute('webdriver') ||
        window.document.documentElement.getAttribute('driver')) {
      this.detectionResults.push('Selenium detected');
    }

    // Check for Puppeteer
    if (window.navigator.webdriver === true) {
      this.detectionResults.push('Puppeteer/WebDriver detected');
    }

    // Check for automation frameworks
    const automationProps = [
      '__webdriver_evaluate',
      '__selenium_evaluate',
      '__webdriver_script_function',
      '__webdriver_script_func',
      '__webdriver_script_fn',
      '__fxdriver_evaluate',
      '__driver_unwrapped',
      '__webdriver_unwrapped',
      '__driver_evaluate',
      '__selenium_unwrapped',
      '__fxdriver_unwrapped'
    ];

    for (const prop of automationProps) {
      if (window.document[prop as keyof Document]) {
        this.detectionResults.push(`Automation property detected: ${prop}`);
      }
    }
  }

  private checkBrowserFeatures(): void {
    // Check for missing expected browser features
    if (!window.localStorage) {
      this.detectionResults.push('Missing localStorage');
    }

    if (!window.sessionStorage) {
      this.detectionResults.push('Missing sessionStorage');
    }

    if (!window.indexedDB) {
      this.detectionResults.push('Missing indexedDB');
    }

    // Check for missing touch events on mobile
    if (navigator.userAgent.includes('Mobile') && !('ontouchstart' in window)) {
      this.detectionResults.push('Missing touch events on mobile');
    }
  }

  private checkUserAgent(): void {
    const ua = navigator.userAgent.toLowerCase();
    
    // Check for bot user agents
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'fetcher', 'parser',
      'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
      'headlesschrome', 'phantomjs', 'selenium', 'webdriver'
    ];

    for (const pattern of botPatterns) {
      if (ua.includes(pattern)) {
        this.detectionResults.push(`Bot user agent detected: ${pattern}`);
      }
    }

    // Check for missing or suspicious user agent
    if (!navigator.userAgent || navigator.userAgent.length < 10) {
      this.detectionResults.push('Suspicious user agent');
    }
  }

  private checkWebDriver(): void {
    // Multiple webdriver checks
    if (navigator.webdriver !== undefined) {
      this.detectionResults.push('WebDriver property detected');
    }

    if (window.document.documentElement.getAttribute('webdriver')) {
      this.detectionResults.push('WebDriver attribute detected');
    }
  }

  private checkPhantomJS(): void {
    // PhantomJS detection
    if (window.callPhantom || window._phantom || window.phantom) {
      this.detectionResults.push('PhantomJS detected');
    }

    if (window.Buffer) {
      this.detectionResults.push('Node.js Buffer detected (PhantomJS)');
    }
  }

  private checkSelenium(): void {
    // Selenium-specific checks
    if (window.document.$cdc_asdjflasutopfhvcZLmcfl_ ||
        window.document.$chrome_asyncScriptInfo ||
        window.document.__$webdriverAsyncExecutor) {
      this.detectionResults.push('Selenium detected');
    }
  }

  private checkWindowProperties(): void {
    // Check for unusual window dimensions
    if (window.outerHeight === 0 || window.outerWidth === 0) {
      this.detectionResults.push('Unusual window dimensions');
    }

    // Check for missing window.external
    if (!window.external) {
      this.detectionResults.push('Missing window.external');
    }

    // Check screen properties
    if (screen.width === 0 || screen.height === 0) {
      this.detectionResults.push('Invalid screen dimensions');
    }
  }

  private checkPlugins(): void {
    // Check for missing plugins (normal browsers have some)
    if (navigator.plugins.length === 0) {
      this.detectionResults.push('No browser plugins detected');
    }

    // Check for missing mimeTypes
    if (navigator.mimeTypes.length === 0) {
      this.detectionResults.push('No MIME types detected');
    }
  }

  private checkCanvas(): void {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        this.detectionResults.push('Canvas context not available');
        return;
      }

      // Draw something and check if it renders
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Bot detection test', 2, 2);
      
      const imageData = canvas.toDataURL();
      
      // Check for blank canvas (common in headless browsers)
      if (imageData === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==') {
        this.detectionResults.push('Blank canvas detected');
      }
    } catch (error) {
      this.detectionResults.push('Canvas error detected');
    }
  }

  private blockAccess(): void {
    // Log the detection
    console.warn('Bot detected:', this.detectionResults);
    
    // Clear the page content
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: Arial, sans-serif;
        background: #f5f5f5;
        color: #333;
        text-align: center;
      ">
        <div>
          <h1>Access Denied</h1>
          <p>Automated access is not permitted.</p>
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    `;
    
    // Prevent further script execution
    throw new Error('Bot access blocked');
  }

  public getDetectionResults(): string[] {
    return this.detectionResults;
  }

  public isBotDetected(): boolean {
    return this.isBot;
  }
}

// Initialize bot detection immediately
export const initBotDetection = (): void => {
  // Run detection after a short delay to allow page to load
  setTimeout(() => {
    BotDetection.getInstance();
  }, 100);
};

// Additional runtime checks
export const performRuntimeChecks = (): void => {
  // Check for automation at runtime
  setInterval(() => {
    if (navigator.webdriver) {
      window.location.href = 'about:blank';
    }
  }, 5000);
  
  // Monitor for DevTools
  let devtools = false;
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      if (!devtools) {
        devtools = true;
        console.clear();
        console.warn('Developer tools detected');
      }
    } else {
      devtools = false;
    }
  }, 1000);
};

// Export for use in main app
export default BotDetection;
