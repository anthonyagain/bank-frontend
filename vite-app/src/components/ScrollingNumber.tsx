import { useState, useEffect, useRef } from 'react';

interface ScrollingNumberProps {
  value: number;
  className?: string;
  duration?: number;
}

export function ScrollingNumber({ value, className = '', duration = 1000 }: ScrollingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    prevValueRef.current = value;

    console.log('ScrollingNumber: value changed from', prevValue, 'to', value);

    const difference = value - prevValue;

    if (difference === 0) return;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = Math.round(prevValue + (difference * easeOutQuart));
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      ${displayValue}
    </span>
  );
}