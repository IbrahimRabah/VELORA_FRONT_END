import { OtpPurpose } from '../../enums/otp-purpose';

export interface OtpSendRequest {
  destination: string;
  purpose: OtpPurpose;
}

export interface OtpVerifyRequest {
  destination: string;
  code: string;
  purpose: OtpPurpose;
}
