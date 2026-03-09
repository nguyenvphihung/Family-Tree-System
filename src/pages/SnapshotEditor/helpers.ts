// ============ HELPER FUNCTIONS ============

/**
 * Validate URL format
 */
export const isValidUrlFormat = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate image can be loaded from URL
 */
export const validateImageUrl = (url: string, timeout: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('[validateImageUrl] Validating URL:', url);
    const img = new Image();
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      console.log('[validateImageUrl] Timeout reached');
      reject(new Error(`Timeout khi tải ảnh (quá ${timeout / 1000} giây)`));
    }, timeout);

    img.onload = () => {
      console.log('[validateImageUrl] Image loaded successfully');
      clearTimeout(timeoutId);
      resolve();
    };

    img.onerror = () => {
      console.log('[validateImageUrl] Image load failed');
      clearTimeout(timeoutId);
      reject(new Error('Không thể tải ảnh từ URL này. Kiểm tra URL hoặc quyền truy cập.'));
    };

    img.src = url;
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Revoke blob URL safely
 */
export const revokeBlobUrl = (url: string | null): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Validate file type and size
 */
export const validateFile = (file: File, maxSize: number): { valid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP, v.v.)' };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File quá lớn. Tối đa ${formatFileSize(maxSize)}`
    };
  }

  return { valid: true };
};

/**
 * Handle HTTP error status codes
 */
export const getErrorMessage = (error: any, defaultMessage: string): string => {
  if (error.name === 'AbortError') {
    return 'Yêu cầu bị hủy. Vui lòng thử lại.';
  }

  switch (error.status) {
    case 413:
      return 'File quá lớn. Vui lòng chọn ảnh nhỏ hơn.';
    case 429:
      return 'Quá nhiều yêu cầu. Vui lòng đợi vài phút.';
    case 503:
      return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
    default:
      return error.message || defaultMessage;
  }
};