import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  OtpSendRequest,
  OtpVerifyRequest,
  RefreshRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ROUTES.auth.register(), body);
  }

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ROUTES.auth.login(), body);
  }

  refresh(body: RefreshRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ROUTES.auth.refresh(), body);
  }

  // Public endpoint — sends the refresh token in the body rather than relying on the
  // current Authorization header, so it works even if the access token already expired.
  logout(refreshToken: string): Observable<MessageResponse> {
    const body: LogoutRequest = { refreshToken };
    return this.http.post<MessageResponse>(API_ROUTES.auth.logout(), body);
  }

  logoutAll(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(API_ROUTES.auth.logoutAll(), null);
  }

  // POST, not GET — the contract is explicit about this. Also note: firstName/lastName/
  // fullName come back null here (built from JWT claims, not a DB lookup); see the
  // warning on TokenStorageService for why the display name must come from login/register.
  me(): Observable<UserResponse> {
    return this.http.post<UserResponse>(API_ROUTES.auth.me(), null);
  }

  sendOtp(body: OtpSendRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(API_ROUTES.auth.sendOtp(), body);
  }

  verifyOtp(body: OtpVerifyRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(API_ROUTES.auth.verifyOtp(), body);
  }

  forgotPassword(body: ForgotPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(API_ROUTES.auth.forgotPassword(), body);
  }

  resetPassword(body: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(API_ROUTES.auth.resetPassword(), body);
  }
}
