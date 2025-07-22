import * as OTPAuth from 'otpauth';

// Generate a secret for a new user
export function generateSecret(): string {
  const secret = new OTPAuth.Secret();

  return secret.base32;
}

// Generate a TOTP for a given secret
export function generateTOTP(secret: string): string {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret),
    digits: 6,
    period: 60 * 10,
  });

  return totp.generate();
}

// Verify a TOTP
export function verifyTOTP(token: string, secret: string): boolean {
  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret),
    digits: 6,
    period: 60 * 10,
  });

  return totp.validate({ token }) !== null;
}
