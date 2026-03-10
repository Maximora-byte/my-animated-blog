'use client';

import { useState, useEffect } from 'react';

interface AnimatedCharacterProps {
  isTyping: boolean;
  isPassword: boolean;
}

export function AnimatedCharacter({ isTyping, isPassword }: AnimatedCharacterProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('character-container')?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 眨眼动画
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getPupilOffset = (eyeX: number, eyeY: number) => {
    const maxOffset = 8;
    const angle = Math.atan2(mousePos.y - eyeY, mousePos.x - eyeX);
    const distance = Math.min(maxOffset, Math.hypot(mousePos.x - eyeX, mousePos.y - eyeY) / 15);
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const leftPupil = getPupilOffset(-25, -10);
  const rightPupil = getPupilOffset(25, -10);

  return (
    <div id="character-container" className="relative w-48 h-48 mx-auto">
      <svg viewBox="-100 -100 200 200" className="w-full h-full drop-shadow-xl">
        {/* 身体 */}
        <ellipse cx="0" cy="50" rx="60" ry="45" fill="#6366F1" />
        <ellipse cx="0" cy="50" rx="50" ry="35" fill="#818CF8" />
        
        {/* 头 */}
        <circle cx="0" cy="-20" r="55" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
        
        {/* 头发 */}
        <path d="M -55 -25 Q -50 -70 0 -75 Q 50 -70 55 -25" fill="#4B5563" />
        
        {/* 左眼 */}
        <g transform="translate(-25, -10)">
          <ellipse rx="18" ry="22" fill="white" stroke="#E5E7EB" strokeWidth="1" />
          {!blink && (
            <circle 
              cx={leftPupil.x} 
              cy={leftPupil.y} 
              r="10" 
              fill="#1F2937"
            >
              <animate attributeName="r" values="10;9;10" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
          {blink && <line x1="-15" y1="0" x2="15" y2="0" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />}
        </g>
        
        {/* 右眼 */}
        <g transform="translate(25, -10)">
          <ellipse rx="18" ry="22" fill="white" stroke="#E5E7EB" strokeWidth="1" />
          {!blink && (
            <circle 
              cx={rightPupil.x} 
              cy={rightPupil.y} 
              r="10" 
              fill="#1F2937"
            >
              <animate attributeName="r" values="10;9;10" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
          {blink && <line x1="-15" y1="0" x2="15" y2="0" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />}
        </g>
        
        {/* 眉毛 - 根据状态变化 */}
        <g transform="translate(-25, -35)">
          <path 
            d={isTyping ? "M -15 -5 Q 0 -15 15 -5" : "M -15 0 Q 0 -5 15 0"}
            stroke="#4B5563" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(25, -35)">
          <path 
            d={isTyping ? "M -15 -5 Q 0 -15 15 -5" : "M -15 0 Q 0 -5 15 0"}
            stroke="#4B5563" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round"
          />
        </g>
        
        {/* 嘴巴 - 根据状态变化 */}
        <path
          d={isTyping 
            ? isPassword 
              ? "M -20 25 Q 0 20 20 25"  // 输入密码时惊讶
              : "M -20 25 Q 0 40 20 25"  // 正常输入时微笑
            : "M -15 30 Q 0 35 15 30"   // 空闲时
          }
          stroke="#1F2937"
          strokeWidth="3"
          fill={isTyping && !isPassword ? "#FCA5A5" : "none"}
          strokeLinecap="round"
        />
        
        {/* 腮红 */}
        {isTyping && (
          <>
            <circle cx="-35" cy="15" r="8" fill="#FCA5A5" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="15" r="8" fill="#FCA5A5" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
