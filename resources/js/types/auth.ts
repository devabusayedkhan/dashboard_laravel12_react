export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    profile_photo?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    permissions: string[];
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type RegisterData = {
    name: string;
    phone: string;
    password: string;
    password_confirmation: string;
};

export type ApiErrorResponse = {
    message?: string;
    token: string;
    errors?: {
        name?: string[];
        phone?: string[];
        email?: string[];
        password?: string[];
        password_confirmation?: string[];
    };
};