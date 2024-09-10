'use client';

import clsx from 'clsx';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import React, { MouseEvent } from 'react';
import { CiCalendar, CiGrid41, CiWavePulse1 } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';

export default function Sidebar({ enabled }: { enabled: string }) {
  return (
    <div className="mr-4 flex h-full flex-col items-start justify-center gap-8 border-r border-night-850 bg-night-950">
      <Item icon={<CiGrid41 />} enabled={enabled} name="dashboard" />
      <Item icon={<CiWavePulse1 />} enabled={enabled} name="trades" />
      <Item icon={<CiCalendar />} enabled={enabled} name="history" />
    </div>
  );
}

function Item({
  icon,
  enabled,
  name,
}: {
  icon: React.ReactElement;
  enabled: string;
  name: string;
}) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ clientX, clientY, currentTarget }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();

    let xPosition = clientX - left;
    let yPosition = clientY - top;

    mouseX.set(xPosition);
    mouseY.set(yPosition);
  }

  return (
    <div
      className={twMerge(
        clsx(
          'group relative flex cursor-pointer items-center justify-center px-4 py-2 text-night-650 hover:text-night-100',
          {
            'border-r border-night-500 text-night-200':
              enabled && name === enabled,
          },
        ),
      )}
    >
      <div className=" grow text-3xl transition">{icon}</div>
      <div className="flex items-center justify-center">
        <motion.div
          className="absolute right-0 hidden translate-x-full rounded-r-xl px-[15px] py-[16px] text-base font-medium capitalize text-night-400 transition-all duration-300 ease-in-out group-hover:block group-hover:text-night-950"
          style={{
            background: useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgb(150 150 150 / 0.4), rgb(5,5,6) 40%)`,
          }}
        >
          {name}
        </motion.div>
        <motion.div
          className="absolute right-0 hidden translate-x-full rounded-r-xl bg-night-950 p-[14px] text-base font-medium capitalize text-night-400 transition-all duration-300 ease-in-out group-hover:block group-hover:text-night-100"
          onMouseMove={handleMouseMove}
        >
          {name}
        </motion.div>
      </div>
    </div>
  );
}
