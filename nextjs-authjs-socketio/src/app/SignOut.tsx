'use client';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MouseEvent } from 'react';
export default function SignOut() {
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
    <motion.button
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      className="relative rounded-xl bg-night-950 px-6 py-2"
    >
      <span className="relative block h-full w-full font-light tracking-wide text-neutral-100">
        Sign Out
      </span>
    </motion.button>
  );
}
