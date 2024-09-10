import { headers } from 'next/headers';

export default function getIp() {
  let forwardedFor = headers().get('x-forwarded-for');
  let realIp = headers().get('x-real-ip');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp.trim();

  return '0.0.0.0';
}
