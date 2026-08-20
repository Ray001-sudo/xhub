"use client";

import dynamic from "next/dynamic";

const AgeVerificationModal = dynamic(
  () => import("@/components/AgeVerificationModal").then((mod) => mod.AgeVerificationModal),
  { ssr: false }
);

export default function AgeVerificationModalLoader() {
  return <AgeVerificationModal />;
}
