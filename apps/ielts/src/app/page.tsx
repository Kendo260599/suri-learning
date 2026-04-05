"use client";

import { useEffect, useState } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Sparkles, GraduationCap, ChevronRight, Zap, Users, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const IELTSApp = dynamic(() => import('@/components/App').then(mod => ({ default: mod.App })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-muted font-medium">Loading...</p>
      </div>
    </div>
  ),
});

function HomeSelector() {
  return (
    <div className="min-h-screen bg-bg text-ink font-sans">
      {/* Header */}
      <div className="bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-extrabold tracking-tight text-ink">
                Suri Learning
              </h1>
              <p className="text-ink-muted mt-1 font-medium">
                Học thông minh — IELTS &amp; HSK
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* App Cards */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-6">
          Chọn ứng dụng học tập
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IELTS Card */}
          <Link href="/ielts" className="group">
            <div className="relative bg-white border-2 border-line rounded-3xl p-8 transition-all duration-300 hover:border-brand-blue hover:shadow-[0_8px_32px_rgba(28,176,246,0.15)] hover:-translate-y-1">
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-brand-blue/10 text-brand-blue text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Zap className="w-3 h-3" />
                  Phổ biến nhất
                </span>
                <h3 className="text-2xl font-display font-extrabold text-ink mb-1">
                  IELTS Prep
                </h3>
                <p className="text-ink-muted font-medium">
                  Luyện thi IELTS 4 kỹ năng
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <FeatureItem icon={<BookOpen className="w-4 h-4" />} text="Reading & Listening" />
                <FeatureItem icon={<Users className="w-4 h-4" />} text="Speaking với AI" />
                <FeatureItem icon={<BarChart2 className="w-4 h-4" />} text="Writing có phản hồi AI" />
              </div>

              <div className="flex items-center gap-2 text-brand-blue font-bold group-hover:gap-4 transition-all">
                <span>Bắt đầu học</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* HSK Card */}
          <Link href="/hsk" className="group">
            <div className="relative bg-white border-2 border-line rounded-3xl p-8 transition-all duration-300 hover:border-[#006c4a] hover:shadow-[0_8px_32px_rgba(0,108,74,0.15)] hover:-translate-y-1">
              <div className="absolute top-6 right-6">
                <div className="w-12 h-12 rounded-2xl bg-[#006c4a] flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 bg-[#006c4a]/10 text-[#006c4a] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3 h-3" />
                  Mới
                </span>
                <h3 className="text-2xl font-display font-extrabold text-ink mb-1">
                  HSK Academy
                </h3>
                <p className="text-ink-muted font-medium">
                  Học tiếng Trung theo giáo trình Msutong
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <FeatureItem icon={<BookOpen className="w-4 h-4" />} text="Từ vựng HSK 1" />
                <FeatureItem icon={<Sparkles className="w-4 h-4" />} text="AI Gia sư trực tuyến" />
                <FeatureItem icon={<BarChart2 className="w-4 h-4" />} text="SRS ôn tập thông minh" />
              </div>

              <div className="flex items-center gap-2 text-[#006c4a] font-bold group-hover:gap-4 transition-all">
                <span>Bắt đầu học</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-muted font-medium">
      <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-ink">
        {icon}
      </div>
      {text}
    </div>
  );
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [showIELTS, setShowIELTS] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (showIELTS) {
    return (
      <ThemeProvider userId={user?.uid ?? null}>
        <IELTSApp />
      </ThemeProvider>
    );
  }

  return <HomeSelector />;
}
