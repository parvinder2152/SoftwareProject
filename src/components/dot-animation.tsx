"use client";

import { useEffect, useRef } from "react";

export default function DotAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f97316", "#e11d48", "#22c55e"];

    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      angle: number;
      distance: number;
      speed: number;
      color: string;
      length: number;

      constructor(cw: number, ch: number) {
        this.originX = cw / 2 + (Math.random() * 400 - 200);
        this.originY = ch / 2 + (Math.random() * 400 - 200);
        
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * Math.max(cw, ch) * 0.8;
        
        this.x = this.originX + Math.cos(this.angle) * this.distance;
        this.y = this.originY + Math.sin(this.angle) * this.distance;
        
        this.speed = 0.0005 + Math.random() * 0.0015;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.length = 3 + Math.random() * 6;
      }

      update(time: number) {
        this.angle += this.speed;
        this.distance += 0.1; // slow outward expansion
        
        if (this.distance > 2000) {
            this.distance = 0;
        }

        // Add some noise based on time
        const noise = Math.sin(this.distance * 0.01 - time * 0.002) * 20;

        this.x = this.originX + Math.cos(this.angle) * (this.distance + noise);
        this.y = this.originY + Math.sin(this.angle) * (this.distance + noise);
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Rotate so the dash faces tangentially
        ctx.rotate(this.angle + Math.PI / 2);
        
        ctx.fillStyle = this.color;
        // Draw a tiny pill-shaped dash (using simple rect for max compatibility)
        ctx.fillRect(-this.length / 2, -1.5, this.length, 3);
        
        ctx.restore();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particles = [];
      const numParticles = Math.min(1200, Math.floor((canvas.width * canvas.height) / 1000));
      
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    let startTime = performance.now();
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
        particles[i].draw(ctx);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate(startTime);

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.8, zIndex: -1 }}
    />
  );
}
