import React, { useState } from 'react';

interface OriginLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  monochrome?: boolean;
  variant?: 'ember' | 'gold' | 'monochrome' | 'flame';
  customLogoUrl?: string;
  customLogoAlt?: string;
  customLogoHeight?: number;
  customSubtitle?: string;
}

export const OriginEmblem: React.FC<{
  className?: string;
  size?: number;
  variant?: 'ember' | 'gold' | 'monochrome' | 'flame';
}> = ({
  className = 'w-9 h-9',
  size = 40,
  variant = 'ember'
}) => {
  const gradientId = `origin-grad-${variant}-${size}`;
  const glowId = `origin-glow-${variant}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        {variant === 'gold' ? (
          <linearGradient id={gradientId} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="40%" stopColor="#FFAA00" />
            <stop offset="80%" stopColor="#FF8800" />
            <stop offset="100%" stopColor="#E66A00" />
          </linearGradient>
        ) : variant === 'monochrome' ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        ) : variant === 'flame' ? (
          <linearGradient id={gradientId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FFCC00" />
            <stop offset="30%" stopColor="#FF6600" />
            <stop offset="70%" stopColor="#FF2200" />
            <stop offset="100%" stopColor="#D9002C" />
          </linearGradient>
        ) : (
          <linearGradient id={gradientId} x1="20%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFA600" />
            <stop offset="35%" stopColor="#FF7A00" />
            <stop offset="70%" stopColor="#FF4D00" />
            <stop offset="100%" stopColor="#FF2600" />
          </linearGradient>
        )}

        <radialGradient id={glowId} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={variant === 'monochrome' ? '#FFFFFF' : '#FFE066'} stopOpacity="0.4" />
          <stop offset="60%" stopColor={variant === 'monochrome' ? '#94A3B8' : '#FF5500'} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main outer ring body with precision aperture notch */}
      <path
        d="M 60 12 
           A 48 48 0 1 1 18.2 82.5 
           L 32.8 72.8 
           A 26 26 0 1 0 60 34 
           A 26 26 0 0 0 37.8 73.2 
           L 15.6 77.2
           A 48 48 0 0 1 60 12 Z"
        fill={`url(#${gradientId})`}
      />

      {/* Dynamic aperture notch accent line cutting through the lower-left */}
      <path
        d="M 12 68 
           C 18 64, 28 62, 38 72 
           L 44 68 
           C 32 56, 18 58, 12 68 Z"
        fill="white"
        opacity={variant === 'monochrome' ? 0.4 : 0.95}
      />

      {/* Center core ring with fine solar rim */}
      <circle
        cx="60"
        cy="60"
        r="48"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        strokeOpacity="0.35"
        fill="none"
      />
    </svg>
  );
};

export const OriginLogo: React.FC<OriginLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  monochrome = false,
  variant,
  customLogoUrl,
  customLogoAlt = 'Origin Labs',
  customLogoHeight,
  customSubtitle,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeMap = {
    sm: { emblem: 28, text: 'text-base', sub: 'text-[8px] tracking-[0.45em]', height: 28 },
    md: { emblem: 36, text: 'text-xl', sub: 'text-[9.5px] tracking-[0.52em]', height: 36 },
    lg: { emblem: 48, text: 'text-2xl', sub: 'text-[11px] tracking-[0.55em]', height: 48 },
    xl: { emblem: 64, text: 'text-4xl', sub: 'text-[14px] tracking-[0.58em]', height: 64 },
  };

  const currentSize = sizeMap[size];
  const effectiveVariant = variant || (monochrome ? 'monochrome' : 'ember');

  // If a custom logo image or SVG data is configured and hasn't errored
  if (customLogoUrl && customLogoUrl.trim().length > 0 && !imageFailed) {
    const renderedHeight = customLogoHeight || currentSize.height;

    // Check if user inputted raw SVG code directly
    const isRawSvg = customLogoUrl.trim().startsWith('<svg');
    const finalSrc = isRawSvg
      ? `data:image/svg+xml;utf8,${encodeURIComponent(customLogoUrl.trim())}`
      : customLogoUrl.trim();

    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <img
          src={finalSrc}
          alt={customLogoAlt}
          onError={() => setImageFailed(true)}
          style={{ height: `${renderedHeight}px`, maxHeight: '80px' }}
          className="w-auto max-w-[280px] object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {customSubtitle && (
          <span className="hidden sm:inline-block text-[10px] font-mono-code text-white/50 tracking-wider">
            {customSubtitle}
          </span>
        )}
      </div>
    );
  }

  // Calculate dynamic dimensions if custom height requested for default vector logo
  const emblemDim = customLogoHeight ? Math.min(Math.max(customLogoHeight, 22), 72) : currentSize.emblem;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Authentic Origin Labs Emblem: Stylized Fiery Solar Aperture "O" */}
      <OriginEmblem
        size={emblemDim}
        variant={effectiveVariant}
        className="transition-transform duration-300 group-hover:scale-105"
      />

      {/* Wordmark: Crisp White "RIGIN" + Spaced "L A B S" */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-heading ${currentSize.text} font-black ${
                effectiveVariant === 'monochrome' ? 'text-white/95' : 'text-white'
              } tracking-wider flex items-center`}
              style={{ letterSpacing: '0.08em' }}
            >
              RIGIN
            </span>
          </div>
          <span
            className={`font-heading ${currentSize.sub} font-semibold text-white/90 uppercase mt-0.5`}
            style={{ textTransform: 'uppercase' }}
          >
            L A B S
          </span>
          {customSubtitle && (
            <span className="text-[8.5px] font-mono-code text-white/50 tracking-wider mt-0.5 hidden md:block">
              {customSubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OriginLogo;
