import crypto from 'crypto';
import base64url from 'base64url'

export function randomStringAsBase64Url(size: number): string {
    return base64url(crypto.randomBytes(size));
}