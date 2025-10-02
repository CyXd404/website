import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', tiltMaxAngle = 10 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * tiltMaxAngle;
    const rotateY = ((centerX - x) / centerX) * tiltMaxAngle;

    setTiltAngle({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltAngle.x,
        rotateY: tiltAngle.y
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
