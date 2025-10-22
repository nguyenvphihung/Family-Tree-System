import { Phone } from "lucide-react";

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth endpoints (auth-controller)
  AUTH: {
    LOGIN: '/auth/login', // POST /auth/login - Đăng nhập
    REGISTER: '/auth/register', // POST /auth/register - Đăng ký
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User endpoints
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    DELETE_ACCOUNT: '/users/account',
    SEARCH: '/users/search',
    BY_ID: '/users',
  },

  // Tree Management endpoints (tree-controller)
  TREES: {
    GET_USER_TREES: '/trees', // GET /trees - Lấy tất cả cây của 1 người dùng
    CREATE_TREE: '/trees', // POST /trees - Tạo mới 1 cây
    UPDATE_TREE: (treeId: string) => `/trees/${treeId}`, // PUT /trees/{treeId} - Sửa thông tin cây
    DELETE_TREE: (treeId: string) => `/trees/${treeId}`, // DELETE /trees/{treeId} - Xoá cây
  },

  // Relations endpoints (relation-controller)
  RELATIONS: {
    // Get tree data
    GET_TREE_RELATIONS: (treeId: string) => `/relations/trees/${treeId}`, // GET /relations/trees/{treeId} - Lấy cây không biết Person
    GET_PERSON_TREE_RELATIONS: (treeId: string, personId: string) => `/relations/trees/${treeId}/persons/${personId}`, // GET /relations/trees/{treeId}/persons/{personId} - Lấy cây kể từ Person

    // Add relations
    ADD_CHILD: (treeId: string) => `/relations/trees/${treeId}/children`, // POST /relations/trees/{treeId}/children - Thêm con cái
    ADD_PARENT: (treeId: string) => `/relations/trees/${treeId}/parent`, // POST /relations/trees/{treeId}/parent - Thêm cha mẹ
    CREATE_ROOT_PERSON: (treeId: string) => `/relations/trees/${treeId}/root`, // POST /relations/trees/{treeId}/root - Tạo người đầu tiên
    ADD_SPOUSE: (treeId: string, spouseId: string) => `/relations/trees/${treeId}/spouses/${spouseId}`, // POST /relations/trees/{treeId}/spouses/{spouseId} - Thêm vợ/chồng
  },

  // Person Management endpoints (person-controller)
  PERSONS: {
    GET_PERSON: '/persons', // GET /persons?personId={personId} - Lấy thông tin 1 người
    UPDATE_PERSON: (personId: string) => `/persons/${personId}`, // PUT /persons/{personId} - Cập nhật toàn bộ thông tin
    DELETE_PERSON: (personId: string) => `/persons/${personId}`, // DELETE /persons/{personId} - Xoá 1 người
    UPDATE_DEATH_INFO: (personId: string) => `/persons/${personId}/death-info`, // PATCH /persons/{personId}/death-info - Cập nhật thông tin người mất
    UPDATE_BIRTH_INFO: (personId: string) => `/persons/${personId}/birth-info`, // PATCH /persons/{personId}/birth-info - Cập nhật thông tin khai sinh
    UPLOAD_AVATAR: (personId: string) => `/persons/${personId}/upload-avatar`, // PATCH /persons/{personId}/upload-avatar - Thêm/cập nhật avatar
  },

  // Album Management endpoints (album-controller)
  ALBUMS: {
    GET_ALBUM_BY_ID: (albumId: string) => `/albums/${albumId}`, // GET /albums/{albumId} - Tìm album bằng Id
    GET_USER_ALBUMS: '/albums', // GET /albums?userId={userId} - Lấy tất cả album của 1 người dùng
    CREATE_ALBUM: '/albums', // POST /albums - Tạo mới 1 album
    UPDATE_ALBUM: (albumId: string) => `/albums/${albumId}`, // PUT /albums/{albumId} - Sửa thông tin album
    DELETE_ALBUM: (albumId: string) => `/albums/${albumId}`, // DELETE /albums/{albumId} - Xoá album
  },

  // Image Management endpoints (image-controller)
  IMAGES: {
    GET_IMAGE: (imageId: string) => `/images/${imageId}`, // GET /images/{imageId} - Lấy ảnh theo imageId
    GET_IMAGES_BY_ALBUM: '/images/by-album', // GET /images/by-album?albumId={albumId} - Lấy ảnh theo albumId
    UPLOAD_IMAGE: '/images/upload', // POST /images/upload?albumId={albumId} - Upload ảnh (body: { file: string })
    DELETE_IMAGE: (imageId: string) => `/images/${imageId}`, // DELETE /images/{imageId} - Xóa ảnh
  },

  // Onboarding endpoints
  ONBOARDING: {
    COMPLETE: '/onboarding/complete',
    STEPS: '/onboarding/steps',
    SAVE_STEP: '/onboarding/save-step',
  },

  // VNPay endpoints (vn-pay-controller)
  VNPAY: {
    CREATE_PAYMENT: '/vnpay/create-payment', // POST /vnpay/create-payment - Tạo thanh toán
    PAYMENT_CALLBACK: '/vnpay/payment-callback', // GET /vnpay/payment-callback - Callback thanh toán
  },
} as const;

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
