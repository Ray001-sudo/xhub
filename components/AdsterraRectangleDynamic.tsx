'use client';
import dynamic from 'next/dynamic';
export const AdsterraRectangleDynamic = dynamic(() => import('./AdsterraRectangle'), { ssr: false });
