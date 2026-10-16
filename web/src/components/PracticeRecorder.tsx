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
    <div className="bg-[#191916] border border-[#3B392F] rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3B392F] gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[#C7A45B] text-xs font-mono uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'ml' ? 'സ്വകാര്യ ലോക്കൽ ഓഡിയോ റെക്കോർഡിംഗ്' : 'Private Local Audio Capture'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F4EBDD]">
            {lang === 'ml' ? 'സാധക റെക്കോർഡർ' : 'Personal Practice Recording'}
          </h3>
          <p className="text-xs text-[#BDB4A4] mt-0.5">
            {lang === 'ml'
              ? 'റെക്കോർഡിംഗുകൾ നിങ്ങളുടെ ബ്രൗസറിൽ മാത്രം സൂക്ഷിക്കപ്പെടുന്നു. യാതൊരു വിവരങ്ങളും അപ്‌ലോഡ് ചെയ്യുന്നില്ല.'
              : 'Recordings remain strictly inside your browser. No audio is uploaded or processed without explicit action.'}
          </p>
        </div>

        <div>
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#A95E45] hover:bg-[#B86850] text-[#F4EBDD] text-xs font-semibold transition-all shadow-md active:scale-95"
            >
              <Circle className="w-4 h-4 fill-current text-white animate-pulse" />
              <span>{lang === 'ml' ? 'സാധകം റെക്കോർഡ് ചെയ്യുക' : 'Record Exercise'}</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#E17D73] text-[#11110F] text-xs font-semibold hover:bg-[#F28B82] transition-all shadow-md animate-pulse"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{lang === 'ml' ? `റെക്കോർഡിംഗ് നിർത്തുക (${formatDuration(recordingSeconds)})` : `Stop Recording (${formatDuration(recordingSeconds)})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Playback & Action Banner */}
      {audioUrl && (
        <div className="mt-5 bg-[#22221D] p-5 rounded-xl border border-[#3B392F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayRecorded}
              className="w-10 h-10 rounded-full bg-[#C7A45B] hover:bg-[#E0C98F] text-[#11110F] flex items-center justify-center transition-colors"
              aria-label={isPlayingRecorded ? 'Pause recorded practice audio' : 'Play recorded practice audio'}
            >
              {isPlayingRecorded ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div>
              <span className="text-xs font-serif font-bold text-[#F4EBDD] block">
                {lang === 'ml' ? 'റെക്കോർഡ് ചെയ്ത സാധക ഓഡിയോ' : 'Recorded Practice Audio'}
              </span>
              <span className="text-[11px] font-mono text-[#BDB4A4]">
                {lang === 'ml' ? 'ദൈർഘ്യം: ' : 'Duration: '}{formatDuration(recordingSeconds)} · Local WebM Blob
              </span>
            </div>

            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlayingRecorded(false)}
              className="hidden"
            />
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={audioUrl}
              download={`nadaverse-practice-${new Date().toISOString().slice(0, 10)}.webm`}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#191916] hover:bg-[#2A2A24] text-[#F4EBDD] border border-[#3B392F] text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C7A45B]" />
              <span>{lang === 'ml' ? 'ഫയൽ ഡൗൺലോഡ് ചെയ്യുക' : 'Download File'}</span>
            </a>

            <button
              onClick={handleDeleteRecording}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#E17D73]/10 hover:bg-[#E17D73]/20 text-[#E17D73] border border-[#E17D73]/30 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'ഒഴിവാക്കുക' : 'Discard Recording'}</span>
            </button>
          </div>
        </div>
      )}

      {!isRecording && !audioUrl && (
        <div className="my-4 text-center py-5 border border-dashed border-[#3B392F] rounded-xl text-xs text-[#BDB4A4]">
          {lang === 'ml'
            ? 'സ്വന്തം സംഗീത സാധകം (സരളീവരിശ, അലങ്കാരം, കീർത്തനം) വിലയിരുത്തുന്നതിന് "സാധകം റെക്കോർഡ് ചെയ്യുക" അമർത്തുക.'
            : 'Press "Record Exercise" when you are ready to record a sarali varisai, alankaram, or kriti passage for personal review.'}
        </div>
      )}
    </div>
  );
};
