import Button from '@/app/components/AtomicUI/Button';
import Link from 'next/link';
import { BiSolidOffer } from 'react-icons/bi';
import { FiUserPlus } from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import { RiMessage3Fill } from 'react-icons/ri';

export default function Follow({
  className,
  username,
}: {
  className?: string;
  username: string;
}) {
  return (
    <div className="mx-auto flex flex-col items-center">
      <div className="my-4 w-full">
        <Button
          color="light"
          variant="primary"
          className="rounded-md font-black"
        >
          <span className="flex items-center">
            <span className="">
              <FiUserPlus />
            </span>
            <span className="ml-2">Follow</span>
          </span>
        </Button>
      </div>

      <Link
        href={`${username}/message`}
        className="flex w-full justify-between"
      >
        <Button
          variant="ghost"
          color="link"
          size="medium"
          className="group mr-1 grow rounded-md"
        >
          <span className="flex items-center">
            <span className="text-night-600 group-hover:text-night-300">
              <RiMessage3Fill />
            </span>
            <span className="ml-2 text-night-200 group-hover:text-night-100">
              Chat
            </span>
          </span>
        </Button>
        <Button
          variant="ghost"
          color="link"
          size="medium"
          className="group mx-1 grow rounded-md px-7 py-1"
        >
          <span className="flex items-center">
            <span className="text-night-600 group-hover:text-night-300">
              <BiSolidOffer />
            </span>
            <span className="ml-2 text-night-200 group-hover:text-night-100">
              Offer
            </span>
          </span>
        </Button>
        <Button
          variant="ghost"
          color="link"
          size="medium"
          className="group ml-1 grow rounded-md px-7 py-1"
        >
          <span className="flex items-center">
            <span className="text-night-600 group-hover:text-night-300">
              <HiFire />
            </span>
            <span className="ml-2 text-night-200 group-hover:text-night-100">
              Share
            </span>
          </span>
        </Button>
      </Link>
    </div>
  );
}
