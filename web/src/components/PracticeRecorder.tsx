'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Circle, Square, Trash2, Download, ShieldCheck, Play, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PracticeRecorderProps {
  onSaveSessionNotes?: (durationSeconds: number) => void;
}

export const PracticeRecorder: React.FC<PracticeRecorderProps> = ({ onSaveSessionNotes }) => {
  const { lang, t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Microphone access is required to record practice sessions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (onSaveSessionNotes) {
        onSaveSessionNotes(recordingSeconds);
      }
    }
  };

  const handleDeleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingSeconds(0);
    setIsPlayingRecorded(false);
  };

  const togglePlayRecorded = () => {
    if (!audioElementRef.current) return;
    if (isPlayingRecorded) {
      audioElementRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="nv-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7A45B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-5 border-b border-[#C7A45B]/20 gap-3 sm:gap-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#87947A]" />
            <span>{lang === 'ml' ? 'സ്വകാര്യ ലോക്കൽ ഓഡിയോ റെക്കോർഡിംഗ്' : 'Private Local Audio Capture'}</span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'സാധക റെക്കോർഡർ' : 'Personal Practice Recording'}
          </h3>
          <p className="text-xs text-[#BDB4A4] mt-1 leading-relaxed">
            {lang === 'ml'
              ? 'റെക്കോർഡിംഗുകൾ നിങ്ങളുടെ ബ്രൗസറിൽ മാത്രം സൂക്ഷിക്കപ്പെടുന്നു. യാതൊരു വിവരങ്ങളും അപ്‌ലോഡ് ചെയ്യുന്നില്ല.'
              : 'Recordings remain strictly inside your browser. No audio is uploaded or processed without explicit action.'}
          </p>
        </div>

        <div className="w-full sm:w-auto">
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="flex items-center justify-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#A95E45] to-[#B86850] hover:from-[#B86850] hover:to-[#C7725A] text-[#F4EBDD] text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#A95E45]/20 active:scale-95 w-full sm:w-auto min-h-[42px]"
            >
              <Circle className="w-4 h-4 fill-current text-white animate-pulse" />
              <span>{lang === 'ml' ? 'സാധകം റെക്കോർഡ് ചെയ്യുക' : 'Record Exercise'}</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E17D73] to-[#F28B82] text-[#11110F] text-xs font-bold tracking-wide transition-all shadow-lg shadow-[#E17D73]/30 animate-pulse active:scale-95 w-full sm:w-auto min-h-[42px]"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>
                {lang === 'ml'
                  ? `റെക്കോർഡിംഗ് നിർത്തുക (${formatDuration(recordingSeconds)})`
                  : `Stop Recording (${formatDuration(recordingSeconds)})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Recording in Progress Visualizer Banner */}
      {isRecording && (
        <div className="mt-4 sm:mt-6 bg-[#0d0c0a]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#E17D73]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="w-4 h-4 rounded-full bg-[#E17D73] block animate-ping absolute" />
              <span className="w-4 h-4 rounded-full bg-[#E17D73] block relative" />
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-[#F4EBDD] block">
                {lang === 'ml' ? 'ഓഡിയോ റെക്കോർഡിംഗ് പുരോഗമിക്കുന്നു...' : 'Recording Live Audio in Progress...'}
              </span>
              <span className="text-xs font-mono text-[#E17D73] font-bold">
                {formatDuration(recordingSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 h-6">
            <span className="w-1 bg-[#E17D73] soundwave-bar soundwave-bar-1 rounded-full" />
            <span className="w-1 bg-[#E17D73] soundwave-bar soundwave-bar-2 rounded-full" />
            <span className="w-1 bg-[#E17D73] soundwave-bar soundwave-bar-3 rounded-full" />
            <span className="w-1 bg-[#E17D73] soundwave-bar soundwave-bar-4 rounded-full" />
            <span className="w-1 bg-[#E17D73] soundwave-bar soundwave-bar-2 rounded-full" />
          </div>
        </div>
      )}

      {/* Playback & Action Banner */}
      {audioUrl && (
        <div className="mt-4 sm:mt-6 bg-[#0d0c0a]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#C7A45B]/25 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={togglePlayRecorded}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#DFB960] to-[#C7A45B] hover:brightness-110 text-[#11110F] flex items-center justify-center transition-all shadow-lg shadow-[#C7A45B]/30 active:scale-95 shrink-0"
              aria-label={isPlayingRecorded ? 'Pause recorded practice audio' : 'Play recorded practice audio'}
            >
              {isPlayingRecorded ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div>
              <span className="text-sm font-serif font-bold text-[#F4EBDD] block">
                {lang === 'ml' ? 'റെക്കോർഡ് ചെയ്ത സാധക ഓഡിയോ' : 'Recorded Practice Audio'}
              </span>
              <span className="text-xs font-mono text-[#E0C98F]">
                {lang === 'ml' ? 'ദൈർഘ്യം: ' : 'Duration: '}{formatDuration(recordingSeconds)} · Local WebM
              </span>
            </div>

            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlayingRecorded(false)}
              className="hidden"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <a
              href={audioUrl}
              download={`nadaverse-practice-${new Date().toISOString().slice(0, 10)}.webm`}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1e1c17] hover:bg-[#282620] text-[#F4EBDD] border border-[#C7A45B]/30 hover:border-[#C7A45B] text-xs font-medium transition-all shadow-sm min-h-[40px]"
            >
              <Download className="w-4 h-4 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'ഫയൽ ഡൗൺലോഡ്' : 'Download Audio'}</span>
            </a>

            <button
              onClick={handleDeleteRecording}
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#E17D73]/10 hover:bg-[#E17D73]/20 text-[#E17D73] border border-[#E17D73]/30 text-xs font-medium transition-all min-h-[40px]"
            >
              <Trash2 className="w-4 h-4" />
              <span>{lang === 'ml' ? 'ഒഴിവാക്കുക' : 'Discard'}</span>
            </button>
          </div>
        </div>
      )}

      {!isRecording && !audioUrl && (
        <div className="my-5 text-center py-6 border border-dashed border-[#C7A45B]/25 rounded-2xl bg-[#0d0c0a]/40 text-xs text-[#BDB4A4] leading-relaxed">
          {lang === 'ml'
            ? 'സ്വന്തം സംഗീത സാധകം (സരളീവരിശ, അലങ്കാരം, കീർത്തനം) വിലയിരുത്തുന്നതിന് "സാധകം റെക്കോർഡ് ചെയ്യുക" അമർത്തുക.'
            : 'Press "Record Exercise" when you are ready to record a sarali varisai, alankaram, or kriti passage for personal review.'}
        </div>
      )}
    </div>
  );
};
