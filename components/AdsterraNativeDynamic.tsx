'use client';
import dynamic from 'next/dynamic';
export const AdsterraNativeDynamic = dynamic(() => import('./AdsterraNative'), { ssr: false });
