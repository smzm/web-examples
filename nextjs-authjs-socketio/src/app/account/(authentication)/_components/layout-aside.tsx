'use client';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

const COLORS = ['#13FFAA', '#1E67c6', '#CE84cF', '#DD335C'];

export default function LayoutAside() {
  const color = useMotionValue(COLORS[0]);
  const backgroundImage = useMotionTemplate`radial-gradient(100% 125% at 50% 0%, transparent 70%, ${color})`;

  useEffect(() => {
    animate(color, COLORS, {
      ease: 'easeInOut',
      duration: 2,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, []);

  return (
    <div></div>
    // <motion.aside
    //   className="bg-neutral-925 relative min-h-screen place-content-center"
    //   style={{
    //     backgroundImage,
    //   }}
    // ></motion.aside>
  );
}
