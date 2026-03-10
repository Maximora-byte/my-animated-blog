'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [canvasData, setCanvasData] = useState('');

  // 生成随机验证码
  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    setIsValid(false);
    onVerify(false);
    
    // 生成画布图像
    generateCanvasImage(code);
  }, [onVerify]);

  // 生成画布图像
  const generateCanvasImage = (code: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 120;
    canvas.height = 40;

    // 背景
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 绘制文字
    for (let i = 0; i < code.length; i++) {
      ctx.font = `bold ${20 + Math.random() * 4}px Arial`;
      ctx.fillStyle = `rgb(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50})`;
      ctx.setTransform(
        1 + Math.random() * 0.2 - 0.1,
        Math.random() * 0.3 - 0.15,
        Math.random() * 0.3 - 0.15,
        1,
        20 + i * 25,
        28
      );
      ctx.fillText(code[i], 0, 0);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    setCanvasData(canvas.toDataURL());
  };

  // 验证输入
  const handleInputChange = (value: string) => {
    setUserInput(value);
    const valid = value.toLowerCase() === captchaCode.toLowerCase();
    setIsValid(valid);
    onVerify(valid);
  };

  // 初始化
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">验证码</label>
      
      <div className="flex items-center gap-3">
        {/* 验证码图像 */}
        <div className="relative">
          {canvasData && (
            <img
              src={canvasData}
              alt="验证码"
              className="rounded-lg border border-gray-200 h-10 w-[120px] cursor-pointer"
              onClick={generateCaptcha}
              title="点击刷新"
            />
          )}
        </div>

        {/* 刷新按钮 */}
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          title="刷新验证码"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* 输入框 */}
        <input
          type="text"
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`flex-1 px-4 py-2 border rounded-xl outline-none transition-all text-center tracking-widest uppercase
            ${isValid 
              ? 'border-green-500 bg-green-50 text-green-700' 
              : userInput 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 bg-gray-50/50 hover:bg-white focus:ring-2 focus:ring-indigo-500'
            }`}
          placeholder="输入验证码"
          maxLength={4}
          required
        />
      </div>
      
      {isValid && (
        <p className="text-green-600 text-sm">✓ 验证通过</p>
      )}
    </div>
  );
}
