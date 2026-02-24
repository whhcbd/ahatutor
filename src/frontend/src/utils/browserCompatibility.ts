export interface BrowserCapabilities {
  features: {
    webgl: boolean;
    webgl2: boolean;
    webgpu: boolean;
    webWorker: boolean;
    serviceWorker: boolean;
    intersectionObserver: boolean;
    resizeObserver: boolean;
    cssGrid: boolean;
    cssFlexbox: boolean;
    cssVariables: boolean;
    animation: boolean;
    transition: boolean;
    transform3d: boolean;
  };
  performance: {
    deviceMemory: number | null;
    hardwareConcurrency: number | null;
    connectionType: string | null;
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
  };
  limitations: {
    maxTextureSize: number;
    maxViewportSize: number;
    maxCanvasSize: number;
  };
}

export interface CompatibilityCheck {
  feature: string;
  supported: boolean;
  required: boolean;
  fallbackAvailable: boolean;
}

export class BrowserCompatibilityChecker {
  private capabilities: BrowserCapabilities | null = null;
  private checks: Map<string, CompatibilityCheck> = new Map();

  constructor() {
    this.detectCapabilities();
    this.runCompatibilityChecks();
  }

  private detectCapabilities(): void {
    const capabilities: BrowserCapabilities = {
      features: {
        webgl: this.checkWebGL(),
        webgl2: this.checkWebGL2(),
        webgpu: this.checkWebGPU(),
        webWorker: this.checkWebWorker(),
        serviceWorker: this.checkServiceWorker(),
        intersectionObserver: this.checkIntersectionObserver(),
        resizeObserver: this.checkResizeObserver(),
        cssGrid: this.checkCSSGrid(),
        cssFlexbox: this.checkCSSFlexbox(),
        cssVariables: this.checkCSSVariables(),
        animation: this.checkAnimation(),
        transition: this.checkTransition(),
        transform3d: this.checkTransform3d()
      },
      performance: this.detectPerformanceMetrics(),
      limitations: this.detectLimitations()
    };

    this.capabilities = capabilities;
    console.log('[Browser Compatibility] Detected capabilities:', capabilities);
  }

  private checkWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  private checkWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  private checkWebGPU(): boolean {
    return 'gpu' in navigator;
  }

  private checkWebWorker(): boolean {
    return typeof Worker !== 'undefined';
  }

  private checkServiceWorker(): boolean {
    return 'serviceWorker' in navigator;
  }

  private checkIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window;
  }

  private checkResizeObserver(): boolean {
    return 'ResizeObserver' in window;
  }

  private checkCSSGrid(): boolean {
    try {
      const elem = document.createElement('div');
      elem.style.display = 'grid';
      return elem.style.display === 'grid';
    } catch (e) {
      return false;
    }
  }

  private checkCSSFlexbox(): boolean {
    try {
      const elem = document.createElement('div');
      elem.style.display = 'flex';
      return elem.style.display === 'flex';
    } catch (e) {
      return false;
    }
  }

  private checkCSSVariables(): boolean {
    try {
      const elem = document.createElement('div');
      elem.style.setProperty('--test', 'value');
      return elem.style.getPropertyValue('--test') === 'value';
    } catch (e) {
      return false;
    }
  }

  private checkAnimation(): boolean {
    try {
      const elem = document.createElement('div');
      elem.style.animation = 'none 0s';
      return elem.style.animation !== '';
    } catch (e) {
      return false;
    }
  }

  private checkTransition(): boolean {
    try {
      const elem = document.createElement('div');
      elem.style.transition = 'none 0s';
      return elem.style.transition !== '';
    } catch (e) {
      return false;
    }
  }

  private checkTransform3d(): boolean {
    try {
      const elem = document.createElement('div');
      elem.style.transform = 'translate3d(0,0,0)';
      return elem.style.transform !== '';
    } catch (e) {
      return false;
    }
  }

  private detectPerformanceMetrics(): BrowserCapabilities['performance'] {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    return {
      deviceMemory: nav.deviceMemory || null,
      hardwareConcurrency: nav.hardwareConcurrency || null,
      connectionType: connection?.type || null,
      effectiveType: connection?.effectiveType || null,
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null
    };
  }

  private detectLimitations(): BrowserCapabilities['limitations'] {
    const limitations: BrowserCapabilities['limitations'] = {
      maxTextureSize: 4096,
      maxViewportSize: 4096,
      maxCanvasSize: 16384
    };

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          limitations.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
          limitations.maxViewportSize = gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0];
        }
      }
    } catch (e) {
      console.warn('[Browser Compatibility] Failed to detect limitations:', e);
    }

    return limitations;
  }

  private runCompatibilityChecks(): void {
    const requiredFeatures: Array<{ name: string; required: boolean; fallbackAvailable: boolean }> = [
      { name: 'webgl', required: false, fallbackAvailable: true },
      { name: 'intersectionObserver', required: true, fallbackAvailable: false },
      { name: 'cssGrid', required: false, fallbackAvailable: true },
      { name: 'cssFlexbox', required: true, fallbackAvailable: true },
      { name: 'animation', required: true, fallbackAvailable: true },
      { name: 'transition', required: true, fallbackAvailable: true },
      { name: 'webWorker', required: false, fallbackAvailable: true },
      { name: 'serviceWorker', required: false, fallbackAvailable: true }
    ];

    requiredFeatures.forEach(feature => {
      const check: CompatibilityCheck = {
        feature: feature.name,
        supported: this.capabilities?.features[feature.name as keyof BrowserCapabilities['features']] as boolean || false,
        required: feature.required,
        fallbackAvailable: feature.fallbackAvailable
      };

      this.checks.set(feature.name, check);

      if (feature.required && !check.supported && !check.fallbackAvailable) {
        console.error(`[Browser Compatibility] Missing required feature: ${feature.name}`);
      }
    });
  }

  getCapabilities(): BrowserCapabilities | null {
    return this.capabilities;
  }

  getCheck(feature: string): CompatibilityCheck | undefined {
    return this.checks.get(feature);
  }

  getAllChecks(): CompatibilityCheck[] {
    return Array.from(this.checks.values());
  }

  isCompatible(requiredFeatures: string[]): boolean {
    return requiredFeatures.every(feature => {
      const check = this.checks.get(feature);
      return check?.supported || check?.fallbackAvailable;
    });
  }

  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];

    if (!this.capabilities?.features.webgl) {
      suggestions.push('WebGL not available - consider using canvas-based rendering');
    }

    if (!this.capabilities?.features.intersectionObserver) {
      suggestions.push('IntersectionObserver not available - use scroll event listeners for lazy loading');
    }

    if (!this.capabilities?.features.cssGrid) {
      suggestions.push('CSS Grid not available - use flexbox or table layouts');
    }

    if (this.capabilities?.performance.deviceMemory && this.capabilities.performance.deviceMemory < 4) {
      suggestions.push('Low memory detected - consider reducing animation complexity');
    }

    if (this.capabilities?.performance.hardwareConcurrency && this.capabilities.performance.hardwareConcurrency < 4) {
      suggestions.push('Low CPU core count - consider using web workers for heavy computations');
    }

    if (this.capabilities?.performance.effectiveType === 'slow-2g' || 
        this.capabilities?.performance.effectiveType === '2g') {
      suggestions.push('Slow network connection detected - consider using progressive loading');
    }

    return suggestions;
  }

  generateReport(): string {
    if (!this.capabilities) {
      return 'Browser compatibility check failed';
    }

    const lines: string[] = [];
    lines.push('=== Browser Compatibility Report ===');
    lines.push(`User Agent: ${navigator.userAgent}`);
    lines.push(`Platform: ${navigator.platform}`);
    lines.push('');
    lines.push('--- Features ---');

    Object.entries(this.capabilities.features).forEach(([feature, supported]) => {
      const status = supported ? '✓' : '✗';
      const check = this.checks.get(feature);
      const required = check?.required ? ' (required)' : '';
      lines.push(`  ${status} ${feature}${required}`);
    });

    lines.push('');
    lines.push('--- Performance ---');
    lines.push(`  Device Memory: ${this.capabilities.performance.deviceMemory || 'Unknown'} GB`);
    lines.push(`  CPU Cores: ${this.capabilities.performance.hardwareConcurrency || 'Unknown'}`);
    lines.push(`  Connection Type: ${this.capabilities.performance.connectionType || 'Unknown'}`);
    lines.push(`  Effective Type: ${this.capabilities.performance.effectiveType || 'Unknown'}`);
    lines.push(`  Downlink: ${this.capabilities.performance.downlink || 'Unknown'} Mbps`);
    lines.push(`  RTT: ${this.capabilities.performance.rtt || 'Unknown'} ms`);

    lines.push('');
    lines.push('--- Limitations ---');
    lines.push(`  Max Texture Size: ${this.capabilities.limitations.maxTextureSize}px`);
    lines.push(`  Max Viewport Size: ${this.capabilities.limitations.maxViewportSize}px`);
    lines.push(`  Max Canvas Size: ${this.capabilities.limitations.maxCanvasSize}px`);

    const suggestions = this.getOptimizationSuggestions();
    if (suggestions.length > 0) {
      lines.push('');
      lines.push('--- Optimization Suggestions ---');
      suggestions.forEach((suggestion, index) => {
        lines.push(`  ${index + 1}. ${suggestion}`);
      });
    }

    return lines.join('\n');
  }
}

export function createBrowserChecker(): BrowserCompatibilityChecker {
  return new BrowserCompatibilityChecker();
}

export function checkFeatureSupport(feature: string): boolean {
  const checker = new BrowserCompatibilityChecker();
  const check = checker.getCheck(feature);
  return check?.supported || false;
}

export function getBrowserReport(): string {
  const checker = new BrowserCompatibilityChecker();
  return checker.generateReport();
}
