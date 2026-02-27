export interface SurfaceState {
  surfaceId: string;
  components: Map<string, any>;
  dataModel: Record<string, any>;
  rootId?: string;
  catalogId?: string;
  isReady: boolean;
}

export interface EnhancedSurfaceState extends SurfaceState {
  status: 'initializing' | 'ready' | 'rendering' | 'paused' | 'destroyed';
  priority: 'critical' | 'high' | 'normal' | 'low';
  visibility: 'visible' | 'hidden' | 'minimized';
  zIndex: number;
  createdAt: number;
  updatedAt: number;
  lastRenderTime?: number;
  metadata?: {
    templateId?: string;
    parentSurfaceId?: string;
    childSurfaceIds?: string[];
  };
  styles?: Record<string, any>;
  bufferSize: number;
  pendingMessages: number;
}

export class SurfaceManager {
  private surfaces: Map<string, EnhancedSurfaceState> = new Map();
  private activeSurfaceId: string | null = null;
  private maxZIndex: number = 100;

  createSurface(
    surfaceId: string,
    priority: 'critical' | 'high' | 'normal' | 'low' = 'normal'
  ): EnhancedSurfaceState {
    if (this.surfaces.has(surfaceId)) {
      throw new Error(`Surface ${surfaceId} already exists`);
    }

    const surface: EnhancedSurfaceState = {
      surfaceId,
      components: new Map(),
      dataModel: {},
      isReady: false,
      status: 'initializing',
      priority,
      visibility: 'visible',
      zIndex: ++this.maxZIndex,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bufferSize: 0,
      pendingMessages: 0,
    };

    this.surfaces.set(surfaceId, surface);
    return surface;
  }

  updateSurface(
    surfaceId: string,
    updates: Partial<EnhancedSurfaceState>
  ): EnhancedSurfaceState | null {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return null;
    }

    const updatedSurface = {
      ...surface,
      ...updates,
      updatedAt: Date.now(),
    };

    this.surfaces.set(surfaceId, updatedSurface);
    return updatedSurface;
  }

  getSurface(surfaceId: string): EnhancedSurfaceState | undefined {
    return this.surfaces.get(surfaceId);
  }

  getAllSurfaces(): Map<string, EnhancedSurfaceState> {
    return new Map(this.surfaces);
  }

  getActiveSurface(): EnhancedSurfaceState | undefined {
    return this.activeSurfaceId ? this.surfaces.get(this.activeSurfaceId) : undefined;
  }

  setActiveSurface(surfaceId: string): boolean {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return false;
    }

    this.activeSurfaceId = surfaceId;
    this.bringToFront(surfaceId);
    return true;
  }

  bringToFront(surfaceId: string): boolean {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return false;
    }

    this.maxZIndex = Math.max(this.maxZIndex + 1, surface.zIndex + 1);
    surface.zIndex = this.maxZIndex;
    surface.updatedAt = Date.now();

    this.surfaces.set(surfaceId, surface);
    return true;
  }

  setSurfaceVisibility(
    surfaceId: string,
    visibility: 'visible' | 'hidden' | 'minimized'
  ): boolean {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return false;
    }

    surface.visibility = visibility;
    surface.updatedAt = Date.now();

    if (visibility === 'visible' && surface.status === 'paused') {
      surface.status = 'ready';
    }

    this.surfaces.set(surfaceId, surface);
    return true;
  }

  setSurfaceStatus(
    surfaceId: string,
    status: EnhancedSurfaceState['status']
  ): boolean {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return false;
    }

    if (status === 'rendering') {
      surface.lastRenderTime = Date.now();
    }

    surface.status = status;
    surface.updatedAt = Date.now();

    this.surfaces.set(surfaceId, surface);
    return true;
  }

  deleteSurface(surfaceId: string): boolean {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return false;
    }

    surface.status = 'destroyed';
    this.surfaces.delete(surfaceId);

    if (this.activeSurfaceId === surfaceId) {
      this.activeSurfaceId = null;
    }

    return true;
  }

  getSurfacesByPriority(): EnhancedSurfaceState[] {
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };

    return Array.from(this.surfaces.values()).sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.zIndex - b.zIndex;
    });
  }

  getVisibleSurfaces(): EnhancedSurfaceState[] {
    return Array.from(this.surfaces.values())
      .filter(s => s.visibility === 'visible')
      .sort((a, b) => b.zIndex - a.zIndex);
  }

  getReadySurfaces(): EnhancedSurfaceState[] {
    return Array.from(this.surfaces.values())
      .filter(s => s.status === 'ready' || s.status === 'rendering')
      .sort((a, b) => b.zIndex - a.zIndex);
  }

  incrementBufferSize(surfaceId: string): number {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return 0;
    }

    surface.bufferSize++;
    surface.updatedAt = Date.now();
    this.surfaces.set(surfaceId, surface);
    return surface.bufferSize;
  }

  decrementBufferSize(surfaceId: string): number {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return 0;
    }

    surface.bufferSize = Math.max(0, surface.bufferSize - 1);
    surface.updatedAt = Date.now();
    this.surfaces.set(surfaceId, surface);
    return surface.bufferSize;
  }

  incrementPendingMessages(surfaceId: string): number {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return 0;
    }

    surface.pendingMessages++;
    surface.updatedAt = Date.now();
    this.surfaces.set(surfaceId, surface);
    return surface.pendingMessages;
  }

  decrementPendingMessages(surfaceId: string): number {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) {
      console.warn(`Surface ${surfaceId} not found`);
      return 0;
    }

    surface.pendingMessages = Math.max(0, surface.pendingMessages - 1);
    surface.updatedAt = Date.now();
    this.surfaces.set(surfaceId, surface);
    return surface.pendingMessages;
  }

  getSurfaceCount(): number {
    return this.surfaces.size;
  }

  clearAll(): void {
    this.surfaces.clear();
    this.activeSurfaceId = null;
    this.maxZIndex = 100;
  }
}
