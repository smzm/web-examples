import defaultAvatar from '@/../public/defaultAvatar.png';
import Image from 'next/image';

export default function Avatar({ user }: any) {
  const { image } = user;

  return (
    <Image
      src={image || defaultAvatar}
      alt="avatar"
      width={50}
      height={50}
      className="rounded-full"
    />
  );
}
