'use client';
import { color, motion } from 'framer-motion';
import { useState } from 'react';

const tabs = [
  {
    id: 'login',
    label: 'Login',
  },
  {
    id: 'signup',
    label: 'Sign Up',
  },
];

export default function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex w-full items-center justify-center space-x-1 rounded-lg bg-night-925 p-2 text-center align-middle ">
      {tabs.map((tab) => {
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id ? '' : 'opacity-40 hover:opacity-80'
            } relative flex grow items-center justify-center px-6 py-2 text-night-200 outline-none transition focus-visible:outline`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg border-2 border-night-750 bg-night-800"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <span className="relative z-10 text-sm font-medium ">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
