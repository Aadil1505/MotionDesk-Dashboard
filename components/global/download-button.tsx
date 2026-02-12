"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_DOWNLOAD_URL ??
  "https://github.com/yourorg/motiondesk/releases/latest/download/MotionDesk.dmg";

const AppleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 225 225" fill="currentColor" className={className}>
    <path d="m108,35 c5.587379,-6.7633 9.348007,-16.178439 8.322067,-25.546439 c-8.053787,0.32369 -17.792625,5.36682 -23.569427,12.126399 c-5.177124,5.985922 -9.711121,15.566772 -8.48777,24.749359 c8.976891,0.69453 18.147476,-4.561718 23.73513,-11.329308" />
    <path d="M88,162.415214 c-12.24469,0 -16.072174,6.151901 -26.213551,6.550446 c-10.52422,0.398254 -18.538303,-10.539917 -25.26247,-20.251053 c-13.740021,-19.864456 -24.24024,-56.132286 -10.1411,-80.613663 c7.004152,-12.157551 19.521101,-19.85622 33.10713,-20.053638 c10.334515,-0.197132 20.089069,6.952717 26.406689,6.952717" />
    <path d="M85,55 c6.313614,0 18.167473,-8.59832 30.628998,-7.335548 c5.21682,0.217129 19.860519,2.1073 29.263641,15.871029 c-0.75766,0.469692 -17.472931,10.200527 -17.291229,30.443592 c0.224838,24.213104 21.241287,32.270615 21.474121,32.373459 c-0.177704,0.56826 -3.358078,11.482742 -11.072464,22.756622 c-6.668747,9.746841 -13.590027,19.457977 -24.493088,19.659103 c-10.713348,0.197403 -14.158287,-6.353043 -26.406677,-6.353043" />
  </svg>
);

interface DownloadButtonProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  label?: string;
}

export default function DownloadButton({
  variant = "default",
  size = "lg",
  className,
  label = "Download for MacOS",
}: DownloadButtonProps) {
  return (
    <Button variant={variant} size={size} asChild className={cn(className)}>
      <a
        href={DOWNLOAD_URL}
        download
        className="flex items-center justify-center"
      >
        {label}
        <AppleIcon className="size-5" />
      </a>
    </Button>
  );
}
