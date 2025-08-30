"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

const AudioPlayer = ({
  src,
  cover,
  title,
}: {
  src: string;
  cover?: string;
  title?: string;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const isYouTube = /youtu\.be|youtube\.com/.test(src);

  const toYouTubeEmbed = (url: string, autoplay: boolean) => {
    try {
      let videoId = "";
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        videoId = u.pathname.replace("/", "");
      } else {
        videoId = u.searchParams.get("v") || "";
      }
      if (!videoId) return null;
      const params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        mute: "0",
        controls: "1",
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        enablejsapi: "1",
        origin: window.location.origin,
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } catch {
      return null;
    }
  };

  const togglePlay = () => {
    if (isYouTube) {
      // Use YouTube Iframe API via postMessage
      const win = iframeRef.current?.contentWindow;
      if (win) {
        win.postMessage(
          JSON.stringify({ event: "command", func: isPlaying ? "pauseVideo" : "playVideo", args: [] }),
          "*"
        );
        setIsPlaying(!isPlaying);
      }
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isFinite(progress) ? progress : 0);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  const handleShuffle = () => setIsShuffle((s) => !s);
  const handleRepeat = () => setIsRepeat((s) => !s);

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="relative flex flex-col mx-auto rounded-3xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm p-3 w-[280px] h-auto"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1, type: "spring" }}
        layout
      >
        {!isYouTube && (
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} src={src} className="hidden" />
        )}

        <motion.div className="flex flex-col relative" layout animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          {cover && !isYouTube && (
            <motion.div className="bg-white/20 overflow-hidden rounded-[16px] h-[180px] w-full relative">
              <img src={cover} alt="cover" className="!object-cover w-full !h-full" />
            </motion.div>
          )}
          {isYouTube && (
            <div className="overflow-hidden rounded-[16px] w-full">
              <iframe
                ref={iframeRef}
                width="100%"
                height="180"
                src={toYouTubeEmbed(src, false) || undefined}
                title={title || "YouTube player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <motion.div className="flex flex-col w-full gap-y-2">
            {title && (
              <motion.h3 className="text-white font-bold text-base text-center mt-1">{title}</motion.h3>
            )}

            {!isYouTube && (
              <motion.div className="flex flex-col gap-y-1">
                <CustomSlider value={progress} onChange={handleSeek} className="w-full" />
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{formatTime(currentTime)}</span>
                  <span className="text-white text-sm">{formatTime(duration)}</span>
                </div>
              </motion.div>
            )}

            <motion.div className="flex items-center justify-center w-full">
              <div className="flex items-center gap-2 w-fit bg-[#11111198] rounded-[16px] p-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShuffle();
                    }}
                    className={cn("text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full", isShuffle && "bg-[#111111d1] text-white")}
                  >
                    <Shuffle className="h-5 w-5" />
                  </Button>
                </motion.div>
                {!isYouTube && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </motion.div>
                {!isYouTube && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRepeat();
                    }}
                    className={cn("text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full", isRepeat && "bg-[#111111d1] text-white")}
                  >
                    <Repeat className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayer;
