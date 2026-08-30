"use client"

import React, { useEffect, useRef } from 'react';

const HeartAnimation = () => {
  // 1. Tambahkan tipe <HTMLCanvasElement> di sini
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Validasi pengaman agar TypeScript tahu canvas tidak null

    // Sekarang TypeScript tahu ini adalah Canvas, dan getContext() bisa digunakan dengan aman!
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Logika animasi bentuk love Anda...
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
  },);

   return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <canvas ref={canvasRef} width={400} height={400} style={{ background: '#000' }} />
    </div>
  );
};

export default HeartAnimation