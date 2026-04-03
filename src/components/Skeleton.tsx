import React from 'react';
import { motion } from 'motion/react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-surface';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-2xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    >
      {animation === 'wave' && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-surface via-white/20 to-surface" />
      )}
    </div>
  );
};

// Preset skeleton components
export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="bg-white border-2 border-line rounded-[2.5rem] p-8 shadow-sm">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="text" width="60%" height={20} className="mb-2" />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '70%' : '100%'}
        height={16}
        className="mb-3"
      />
    ))}
  </div>
);

export const QuizSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <div className="sticky top-0 z-50 w-full bg-white px-6 py-4 flex items-center gap-6 border-b border-line">
      <Skeleton variant="rectangular" width={32} height={32} className="rounded-xl" />
      <div className="flex-1">
        <Skeleton variant="rectangular" height={12} className="rounded-full" />
      </div>
    </div>
    <div className="flex-1 px-6 max-w-2xl mx-auto w-full flex flex-col py-8">
      <Skeleton variant="text" width="80%" height={32} className="mb-10" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={80}
            className="rounded-[1.5rem]"
          />
        ))}
      </div>
    </div>
    <div className="border-t-2 p-6 sm:p-10 bg-white border-line">
      <Skeleton variant="rounded" height={56} className="rounded-[1.5rem] w-full sm:w-64" />
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-bg pb-32 flex flex-col items-center">
    <div className="w-full max-w-2xl mx-auto p-6 flex flex-col gap-8 mt-4">
      <div className="bg-white border-2 border-ink/5 rounded-[2.5rem] p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8">
        <Skeleton variant="circular" width={112} height={112} />
        <div className="flex-1 text-center sm:text-left">
          <Skeleton variant="text" width="60%" height={32} className="mb-3 mx-auto sm:mx-0" />
          <Skeleton variant="text" width="40%" height={16} className="mb-4 mx-auto sm:mx-0" />
          <Skeleton variant="rounded" width={120} height={36} className="mx-auto sm:mx-0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border-2 border-ink/5 rounded-[2rem] p-6 shadow-sm">
            <Skeleton variant="rounded" width={48} height={48} className="mb-4" />
            <Skeleton variant="text" width="50%" height={28} className="mb-2" />
            <Skeleton variant="text" width="80%" height={12} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LeaderboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-bg pb-32">
    <div className="w-full max-w-2xl mx-auto p-6 flex flex-col gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white border-2 border-ink/5 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton variant="text" width="50%" height={18} className="mb-2" />
            <Skeleton variant="text" width="30%" height={12} />
          </div>
          <Skeleton variant="rounded" width={80} height={36} className="rounded-2xl" />
        </div>
      ))}
    </div>
  </div>
);

export const RoadmapTopicSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-16 relative">
    <div className="relative z-10 flex flex-col items-center">
      <Skeleton variant="rounded" width={96} height={96} className="rounded-[2rem]" />
      <Skeleton variant="rounded" width={100} height={32} className="mt-4 rounded-2xl" />
    </div>
  </div>
);

// Animated shimmer keyframes (add to index.css or tailwind config)
// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }
