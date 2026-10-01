export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface MessageResponse {
  message: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FeedbackItem {
  id: number;
  message: string;
  date: string;
  username: string;
}
