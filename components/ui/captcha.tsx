"use client";

import { useEffect, useState, useRef } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  onChange: (isValid: boolean) => void;
  onValueChange?: (value: string) => void;
}

export function Captcha({ onChange, onValueChange }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random CAPTCHA text
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput("");
    onChange(false);
    if (onValueChange) onValueChange("");
    return text;
  };

  // Draw CAPTCHA on canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text with random styling
    ctx.font = "bold 32px Arial";
    ctx.textBaseline = "middle";

    let x = 20;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const y = 35 + Math.random() * 10 - 5;
      const rotate = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotate);

      // Random color for each character
      const hue = Math.random() * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 40%)`;
      ctx.fillText(char, 0, 0);

      ctx.restore();
      x += 30;
    }

    // Add noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
  };

  useEffect(() => {
    const text = generateCaptcha();
    drawCaptcha(text);
  }, []);

  useEffect(() => {
    if (captchaText) {
      drawCaptcha(captchaText);
    }
  }, [captchaText]);

  useEffect(() => {
    const isValid = userInput.length > 0 && userInput === captchaText;
    onChange(isValid);
  }, [userInput, captchaText, onChange]);

  const handleRefresh = () => {
    const text = generateCaptcha();
    drawCaptcha(text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    if (onValueChange) onValueChange(value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider">
        Security Verification
      </label>
      <div className="flex gap-2">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={200}
            height={70}
            className="border-2 border-gray-200 rounded"
          />
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="px-3 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center justify-center"
          title="Refresh CAPTCHA"
        >
          <RefreshCw className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Type the text above"
        value={userInput}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-[#f8f9fa] border-2 border-gray-200 rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all"
        autoComplete="off"
      />
    </div>
  );
}
