// ============ CONSTANTS ============
export const IMAGE_VALIDATION_TIMEOUT = 5000; // 5 seconds
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ROUTES = {
  FAMILY_TREE: '/family-tree-demo'
} as const;

export const STORAGE_KEYS = {
  RESTORED_IMAGE: 'restoredImage'
} as const;

export enum RestoreMethod {
  FILE = 'file',
  URL = 'url'
}