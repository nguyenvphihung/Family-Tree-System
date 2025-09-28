import { Phone } from "lucide-react";

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
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

  // Family/Relations endpoints
  RELATIONS: {
    // Tree management
    CREATE_TREE: '/trees',
    GET_USER_TREES: '/trees',
    UPDATE_TREE: '/trees',
    DELETE_TREE: '/trees',
    GET_TREE_RELATIONS: '/relations/trees',
    GET_PERSON_TREE_RELATIONS: '/relations/trees',

    // Tree relations
    ADD_CHILD: '/relations/trees',
    ADD_PARENT: '/relations/trees',
    CREATE_ROOT_PERSON: '/relations/trees',
    ADD_SPOUSE: '/relations/trees',

    // Person management
    DELETE_PERSON: '/persons',
  },

  // Album endpoints
  ALBUMS: {
    CREATE_ALBUM: '/albums',
    UPDATE_ALBUM: '/albums',
    DELETE_ALBUM: '/albums',
    GET_USER_ALBUMS: '/albums',
    GET_ALBUM_BY_ID: '/albums',
  },

  // Image endpoints
  IMAGES: {
    GET_IMAGE: '/images',
    GET_IMAGES_BY_ALBUM: '/images/by-album',
    UPLOAD_IMAGE: '/images/upload',
    DELETE_IMAGE: '/images',
  },

  // Onboarding endpoints
  ONBOARDING: {
    COMPLETE: '/onboarding/complete',
    STEPS: '/onboarding/steps',
    SAVE_STEP: '/onboarding/save-step',
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
