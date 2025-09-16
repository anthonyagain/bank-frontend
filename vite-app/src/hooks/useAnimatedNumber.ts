import { useState, useEffect, useRef } from 'react';

export function useAnimatedNumber(targetValue: number, duration = 1000) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number | null>(null);
  const prevTargetRef = useRef(targetValue);

  useEffect(() => {
    const prevTarget = prevTargetRef.current;

    if (prevTarget === targetValue) return;

    console.log('Animating from', prevTarget, 'to', targetValue);

    const startValue = prevTarget; // Always start from the previous target, not current display
    const difference = targetValue - startValue;
    const startTime = Date.now();

    prevTargetRef.current = targetValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (difference * easeOutQuart));

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
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
  }, [targetValue, duration]);

  return displayValue;
}