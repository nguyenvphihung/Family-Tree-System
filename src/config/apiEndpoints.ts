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
    CREATE_TREE_ROOT: '/trees',
    ADD_CHILDREN: '/trees',
    ADD_PARENT: '/trees',
    ADD_SPOUSE: '/trees',

    // Person management
    GET_PERSON: '/trees',
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
