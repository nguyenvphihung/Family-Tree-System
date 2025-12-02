/**
 * Validation utilities for form inputs and API requests
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export class ValidationError extends Error {
    constructor(
        message: string,
        public errors: string[] = []
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

// ========================
// VALIDATION PATTERNS
// ========================

export const VALIDATION_PATTERNS = {
    // Số điện thoại Việt Nam (10-11 số, bắt đầu bằng 0)
    PHONE: /^0[0-9]{9,10}$/,

    // Email chuẩn
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Mật khẩu: ít nhất 6 ký tự
    PASSWORD: /^.{6,}$/,

    // Tên: chỉ chữ cái, số, khoảng trắng và các ký tự tiếng Việt
    NAME: /^[a-zA-ZÀ-ỹ0-9\s]+$/,

    // URL
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,

    // Số dương
    POSITIVE_NUMBER: /^[1-9]\d*$/,

    // Ngày tháng (YYYY-MM-DD)
    DATE: /^\d{4}-\d{2}-\d{2}$/,
} as const;

// ========================
// VALIDATION MESSAGES
// ========================

export const VALIDATION_MESSAGES = {
    REQUIRED: 'Trường này là bắt buộc',
    INVALID_PHONE: 'Số điện thoại không hợp lệ (phải là 10-11 số và bắt đầu bằng 0)',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự',
    PASSWORD_MISMATCH: 'Mật khẩu không khớp',
    INVALID_NAME: 'Tên chỉ được chứa chữ cái, số và khoảng trắng',
    INVALID_URL: 'URL không hợp lệ',
    INVALID_DATE: 'Ngày tháng không hợp lệ',
    INVALID_DATE_RANGE: 'Ngày kết thúc phải sau ngày bắt đầu',
    MIN_LENGTH: (min: number) => `Phải có ít nhất ${min} ký tự`,
    MAX_LENGTH: (max: number) => `Không được vượt quá ${max} ký tự`,
    MIN_VALUE: (min: number) => `Giá trị phải lớn hơn hoặc bằng ${min}`,
    MAX_VALUE: (max: number) => `Giá trị phải nhỏ hơn hoặc bằng ${max}`,
    FILE_TOO_LARGE: (maxSizeMB: number) => `File không được vượt quá ${maxSizeMB}MB`,
    INVALID_FILE_TYPE: (allowedTypes: string[]) => `Chỉ chấp nhận các định dạng: ${allowedTypes.join(', ')}`,
    FUTURE_DATE_NOT_ALLOWED: 'Ngày không được ở tương lai',
    INVALID_GENDER: 'Giới tính không hợp lệ (chỉ chấp nhận: MALE, FEMALE, OTHER)',
} as const;

// ========================
// FIELD VALIDATORS
// ========================

export const validators = {
    /**
     * Validate required field
     */
    required: (value: any, fieldName: string = 'Trường này'): string | null => {
        if (value === null || value === undefined || value === '') {
            return `${fieldName} là bắt buộc`;
        }
        if (typeof value === 'string' && value.trim() === '') {
            return `${fieldName} không được để trống`;
        }
        return null;
    },

    /**
     * Validate phone number (Vietnamese format)
     */
    phone: (value: string): string | null => {
        if (!value) return null;
        if (!VALIDATION_PATTERNS.PHONE.test(value)) {
            return VALIDATION_MESSAGES.INVALID_PHONE;
        }
        return null;
    },

    /**
     * Validate email
     */
    email: (value: string): string | null => {
        if (!value) return null;
        if (!VALIDATION_PATTERNS.EMAIL.test(value)) {
            return VALIDATION_MESSAGES.INVALID_EMAIL;
        }
        return null;
    },

    /**
     * Validate password
     */
    password: (value: string): string | null => {
        if (!value) return null;
        if (!VALIDATION_PATTERNS.PASSWORD.test(value)) {
            return VALIDATION_MESSAGES.INVALID_PASSWORD;
        }
        return null;
    },

    /**
     * Validate password confirmation
     */
    passwordMatch: (password: string, confirmPassword: string): string | null => {
        if (password !== confirmPassword) {
            return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
        }
        return null;
    },

    /**
     * Validate name (letters, numbers, spaces, Vietnamese characters)
     */
    name: (value: string): string | null => {
        if (!value) return null;
        if (!VALIDATION_PATTERNS.NAME.test(value)) {
            return VALIDATION_MESSAGES.INVALID_NAME;
        }
        return null;
    },

    /**
     * Validate URL
     */
    url: (value: string): string | null => {
        if (!value) return null;
        if (!VALIDATION_PATTERNS.URL.test(value)) {
            return VALIDATION_MESSAGES.INVALID_URL;
        }
        return null;
    },

    /**
     * Validate date (YYYY-MM-DD)
     */
    date: (value: string): string | null => {
        if (!value) return null;
        if (!VALIDATION_PATTERNS.DATE.test(value)) {
            return VALIDATION_MESSAGES.INVALID_DATE;
        }
        // Check if date is valid
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return VALIDATION_MESSAGES.INVALID_DATE;
        }
        return null;
    },

    /**
     * Validate date is not in the future
     */
    notFutureDate: (value: string): string | null => {
        if (!value) return null;
        const date = new Date(value);
        const now = new Date();

        return null;
    },

    /**
     * Validate date range
     */
    dateRange: (startDate: string, endDate: string): string | null => {
        if (!startDate || !endDate) return null;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            return VALIDATION_MESSAGES.INVALID_DATE_RANGE;
        }
        return null;
    },

    /**
     * Validate min length
     */
    minLength: (value: string, min: number): string | null => {
        if (!value) return null;
        if (value.length < min) {
            return VALIDATION_MESSAGES.MIN_LENGTH(min);
        }
        return null;
    },

    /**
     * Validate max length
     */
    maxLength: (value: string, max: number): string | null => {
        if (!value) return null;
        if (value.length > max) {
            return VALIDATION_MESSAGES.MAX_LENGTH(max);
        }
        return null;
    },

    /**
     * Validate min value
     */
    minValue: (value: number, min: number): string | null => {
        if (value === null || value === undefined) return null;
        if (value < min) {
            return VALIDATION_MESSAGES.MIN_VALUE(min);
        }
        return null;
    },

    /**
     * Validate max value
     */
    maxValue: (value: number, max: number): string | null => {
        if (value === null || value === undefined) return null;
        if (value > max) {
            return VALIDATION_MESSAGES.MAX_VALUE(max);
        }
        return null;
    },

    /**
     * Validate file size
     */
    fileSize: (file: File, maxSizeMB: number): string | null => {
        if (!file) return null;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return VALIDATION_MESSAGES.FILE_TOO_LARGE(maxSizeMB);
        }
        return null;
    },

    /**
     * Validate file type
     */
    fileType: (file: File, allowedTypes: string[]): string | null => {
        if (!file) return null;
        const fileType = file.type;
        const fileExt = file.name.split('.').pop()?.toLowerCase();

        const isAllowed = allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileExt === type.substring(1);
            }
            return fileType === type || fileType.startsWith(type + '/');
        });

        if (!isAllowed) {
            return VALIDATION_MESSAGES.INVALID_FILE_TYPE(allowedTypes);
        }
        return null;
    },

    /**
     * Validate gender
     */
    gender: (value: string): string | null => {
        if (!value) return null;
        const validGenders = ['M', 'F', 'U'];
        if (!validGenders.includes(value.toUpperCase())) {
            return VALIDATION_MESSAGES.INVALID_GENDER;
        }
        return null;
    },
};

// ========================
// VALIDATION HELPERS
// ========================

/**
 * Combine multiple validators
 */
export function combineValidators(
    ...validatorFns: Array<() => string | null>
): ValidationResult {
    const errors: string[] = [];

    for (const validatorFn of validatorFns) {
        const error = validatorFn();
        if (error) {
            errors.push(error);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate an object with multiple fields
 */
export function validateObject<T extends Record<string, any>>(
    obj: T,
    rules: Partial<Record<keyof T, Array<(value: any) => string | null>>>
): ValidationResult {
    const errors: string[] = [];

    for (const [field, validatorFns] of Object.entries(rules)) {
        const value = obj[field as keyof T];
        for (const validatorFn of validatorFns as Array<(value: any) => string | null>) {
            const error = validatorFn(value);
            if (error) {
                errors.push(`${String(field)}: ${error}`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Throw validation error if validation fails
 */
export function throwIfInvalid(result: ValidationResult): void {
    if (!result.isValid) {
        throw new ValidationError(
            result.errors[0] || 'Validation failed',
            result.errors
        );
    }
}

/**
 * Show validation error toast and throw error if validation fails
 */
export function validateAndShowToast(result: ValidationResult, toast: any): void {
    if (!result.isValid) {
        const errorMessage = result.errors[0] || 'Dữ liệu không hợp lệ';
        toast.error(errorMessage, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        throw new ValidationError(errorMessage, result.errors);
    }
}// ========================
// SPECIFIC VALIDATORS FOR API
// ========================

/**
 * Validate login credentials
 */
export function validateLoginCredentials(phone: string, password: string): ValidationResult {
    return combineValidators(
        () => validators.required(phone, 'Số điện thoại'),
        () => validators.phone(phone),
        () => validators.required(password, 'Mật khẩu'),
        () => validators.password(password)
    );
}

/**
 * Validate register credentials
 */
export function validateRegisterCredentials(
    phone: string,
    password: string,
    confirmPassword: string,
    fullName: string
): ValidationResult {
    return combineValidators(
        () => validators.required(phone, 'Số điện thoại'),
        () => validators.phone(phone),
        () => validators.required(password, 'Mật khẩu'),
        () => validators.password(password),
        () => validators.required(confirmPassword, 'Xác nhận mật khẩu'),
        () => validators.passwordMatch(password, confirmPassword),
        () => validators.required(fullName, 'Họ và tên'),
        () => validators.name(fullName),
        () => validators.minLength(fullName, 2),
        () => validators.maxLength(fullName, 100)
    );
}

/**
 * Validate tree name
 */
export function validateTreeName(name: string): ValidationResult {
    return combineValidators(
        () => validators.required(name, 'Tên cây gia phả'),
        () => validators.minLength(name, 2),
        () => validators.maxLength(name, 100)
    );
}

/**
 * Validate person info
 */
export function validatePersonInfo(data: {
    fullName: string;
    gender?: string;
    dateOfBirth?: string;
    dateOfDeath?: string;
}): ValidationResult {
    const validations: Array<() => string | null> = [
        () => validators.required(data.fullName, 'Họ và tên'),
        () => validators.name(data.fullName),
        () => validators.minLength(data.fullName, 2),
        () => validators.maxLength(data.fullName, 100),
    ];

    if (data.gender) {
        validations.push(() => validators.gender(data.gender!));
    }

    if (data.dateOfBirth) {
        validations.push(
            () => validators.date(data.dateOfBirth!),
            () => validators.notFutureDate(data.dateOfBirth!)
        );
    }

    if (data.dateOfDeath) {
        validations.push(
            () => validators.date(data.dateOfDeath!),
            () => validators.notFutureDate(data.dateOfDeath!)
        );
    }

    if (data.dateOfBirth && data.dateOfDeath) {
        validations.push(() => validators.dateRange(data.dateOfBirth!, data.dateOfDeath!));
    }

    return combineValidators(...validations);
}

/**
 * Validate birth info
 */
export function validateBirthInfo(data: {
    dateOfBirth?: string;
    placeOfBirth?: string;
}): ValidationResult {
    const validations: Array<() => string | null> = [];

    if (data.dateOfBirth) {
        validations.push(
            () => validators.date(data.dateOfBirth!),
            () => validators.notFutureDate(data.dateOfBirth!)
        );
    }

    if (data.placeOfBirth) {
        validations.push(
            () => validators.maxLength(data.placeOfBirth!, 200)
        );
    }

    return combineValidators(...validations);
}

/**
 * Validate death info
 */
export function validateDeathInfo(data: {
    dateOfDeath?: string;
    placeOfDeath?: string;
}): ValidationResult {
    const validations: Array<() => string | null> = [];

    if (data.dateOfDeath) {
        validations.push(
            () => validators.date(data.dateOfDeath!),
            () => validators.notFutureDate(data.dateOfDeath!)
        );
    }

    if (data.placeOfDeath) {
        validations.push(
            () => validators.maxLength(data.placeOfDeath!, 200)
        );
    }

    return combineValidators(...validations);
}

/**
 * Validate image upload
 */
export function validateImageUpload(file: File): ValidationResult {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSizeMB = 10; // 10MB

    return combineValidators(
        () => validators.required(file, 'File ảnh'),
        () => validators.fileSize(file, maxSizeMB),
        () => validators.fileType(file, allowedTypes)
    );
}

/**
 * Validate album name
 */
export function validateAlbumName(name: string): ValidationResult {
    return combineValidators(
        () => validators.required(name, 'Tên album'),
        () => validators.minLength(name, 2),
        () => validators.maxLength(name, 100)
    );
}

/**
 * Validate change password
 */
export function validateChangePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
): ValidationResult {
    return combineValidators(
        () => validators.required(currentPassword, 'Mật khẩu hiện tại'),
        () => validators.required(newPassword, 'Mật khẩu mới'),
        () => validators.password(newPassword),
        () => validators.required(confirmNewPassword, 'Xác nhận mật khẩu mới'),
        () => validators.passwordMatch(newPassword, confirmNewPassword)
    );
}

/**
 * Validate user profile update
 */
export function validateUserProfile(data: {
    fullName?: string;
    email?: string;
    phone?: string;
}): ValidationResult {
    const validations: Array<() => string | null> = [];

    if (data.fullName) {
        validations.push(
            () => validators.name(data.fullName!),
            () => validators.minLength(data.fullName!, 2),
            () => validators.maxLength(data.fullName!, 100)
        );
    }

    if (data.email) {
        validations.push(() => validators.email(data.email!));
    }

    if (data.phone) {
        validations.push(() => validators.phone(data.phone!));
    }

    return combineValidators(...validations);
}
