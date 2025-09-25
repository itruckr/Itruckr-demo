import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";

interface Props {
    url: string
}

export const AudioPlayer = ({ url }: Props) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (waveformRef.current) {
      const ws = wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#000",
        cursorColor: "#333",
        barWidth: 2,
        height: 80,
      });

      ws.load(url);
      wavesurferRef.current = ws;

      ws.on("ready", () =>{
        setDuration(ws.getDuration());
      });

      ws.on("play", () => setIsPlaying(true));

      ws.on("pause", () => setIsPlaying(false));

      ws.on("audioprocess", () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on("seeking", (progress: number) => {
        setCurrentTime(progress * ws.getDuration());
      });

      ws.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
    return () => wavesurferRef.current?.destroy();
  }, [url]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(wavesurferRef.current.isPlaying());
    }
  };

  return (
    <div className="w-full p-6 border rounded-2xl shadow-xl max-w-lg bg-transparent">
      <div ref={waveformRef} className="mb-4"></div>
      <div className="flex items-center gap-6">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white shadow-md hover:bg-slate-700 active:scale-95 transition"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <div className="flex-1 text-slate-700">
          <div className="font-medium">
            {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </div>
          <div className="h-1 bg-slate-200 rounded-full mt-1">
            <div
              className="h-1 bg-slate-800 rounded-full transition-all"
              style={{ width: duration > 0 ? `${((currentTime / duration) * 100).toFixed(2)}%` : "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
