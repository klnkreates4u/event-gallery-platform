'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PolkaDotBg } from '@/components/ui/polka-dot-bg';
import { ThemeToggle } from '@/components/theme-toggle';
import { siteConfig } from '@/config/site';

import { loginAdminAction } from '@/actions/auth';
import { useToast } from '@/providers/toast-provider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const res = await loginAdminAction(formData);
    
    if (res?.error) {
      error('Login Failed', res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-6 bg-soft-cream/30 dark:bg-neutral-950 overflow-hidden">
      <PolkaDotBg />

      {/* Floating Header Bar */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Banner */}
        <div className="text-center mb-8 space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-button bg-primary-black dark:bg-soft-cream flex items-center justify-center text-white dark:text-primary-black font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              <span>{siteConfig.logo.symbol}</span>
            </div>
          </Link>
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-primary-black dark:text-soft-cream">
            Studio Portal Login
          </h1>
          <p className="text-xs text-muted-gray">
            Sign in to manage your white-label galleries, events, and analytics.
          </p>
        </div>

        {/* Login Card */}
        <Card glass className="p-8 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email Address"
              placeholder="studio@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-muted-gray" />}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-muted-gray" />}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-primary-black dark:text-soft-cream">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm accent-velvet-red w-4 h-4 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link sent to your email.');
                }}
                className="text-muted-gray hover:text-velvet-red transition-colors font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isLoading}
              className="w-full h-12 mt-2 font-medium tracking-wide"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-warm-ivory/60 dark:border-neutral-800/60 text-center flex items-center justify-center gap-1.5 text-[11px] text-muted-gray">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>256-bit encrypted authentication strategy</span>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-muted-gray hover:text-primary-black dark:hover:text-soft-cream transition-colors">
            ← Return to Public Gallery Platform
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
