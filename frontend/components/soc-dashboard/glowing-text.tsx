'use client';

interface GlowingTextProps {
  children: React.ReactNode;
  color?: 'green' | 'red';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlowingText({
  children,
  color = 'green',
  intensity = 'medium',
  className = '',
}: GlowingTextProps) {
  const colorClass = color === 'green' ? 'text-neon-green' : 'text-neon-red';
  const glowClass = intensity === 'high' ? 'animate-glow' : '';

  return (
    <span
      className={`font-mono font-bold ${colorClass} ${glowClass} ${className}`}
      style={{
        textShadow:
          color === 'green'
            ? '0 0 5px rgba(0, 255, 0, 0.5), 0 0 10px rgba(0, 255, 136, 0.3)'
            : '0 0 5px rgba(255, 0, 85, 0.5), 0 0 10px rgba(255, 23, 68, 0.3)',
      }}
    >
      {children}
    </span>
  );
}
