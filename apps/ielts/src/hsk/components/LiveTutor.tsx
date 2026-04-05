"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageSquare, Sparkles, X, Play, Square } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export default function LiveTutor() {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState<string>("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcription, aiResponse]);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "Bạn là một giáo viên tiếng Trung vui vẻ và kiên nhẫn. Hãy trò chuyện với học viên bằng tiếng Trung HSK1 đơn giản. Nếu học viên nói sai, hãy sửa lỗi một cách nhẹ nhàng bằng tiếng Việt. Luôn khuyến khích học viên nói nhiều hơn.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setupAudio();
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              playOutputAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
            }
            
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
               setAiResponse(prev => prev + message.serverContent?.modelTurn?.parts[0]?.text);
            }

            const inputTranscription = message.serverContent?.userTurn?.parts[0]?.text;
            if (inputTranscription) {
              setTranscription(prev => [...prev, `Bạn: ${inputTranscription}`]);
            }
            
            const outputTranscription = message.serverContent?.modelTurn?.parts[0]?.text;
            if (outputTranscription && message.serverContent?.modelTurn?.parts[0]?.text?.endsWith('.')) {
               setTranscription(prev => [...prev, `AI: ${outputTranscription}`]);
               setAiResponse("");
            }
          },
          onclose: () => stopSession(),
          onerror: (err) => {
            console.error("Live API Error:", err);
            stopSession();
          }
        }
      });
      
      sessionRef.current = session;
    } catch (error) {
      console.error("Failed to connect to Live API:", error);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    sessionRef.current?.close();
    sessionRef.current = null;
    
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    
    processorRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
  };

  const setupAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        if (isMuted || !sessionRef.current) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };
      
      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error("Audio setup failed:", error);
    }
  };

  const playOutputAudio = (base64Data: string) => {
    if (!audioContextRef.current) return;
    
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }
    
    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 16000);
    buffer.getChannelData(0).set(floatData);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto px-6 py-6">
      <div className="bg-surface-container-lowest rounded-[2.5rem] flex-1 flex flex-col shadow-xl border border-surface-container-highest overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-surface-container-highest flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
              <Sparkles className="w-6 h-6" />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </div>
            <div>
              <h3 className="font-headline font-black text-xl text-on-surface">Gia sư AI Trực tuyến</h3>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {isActive ? 'Đang trò chuyện...' : isConnecting ? 'Đang kết nối...' : 'Sẵn sàng luyện nói'}
              </p>
            </div>
          </div>
          
          {isActive && (
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-lowest/50">
          {transcription.length === 0 && !aiResponse && !isActive && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                <MessageSquare className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-xl font-headline font-bold text-on-surface mb-2">Bắt đầu hội thoại</h4>
                <p className="text-on-surface-variant max-w-xs mx-auto text-sm font-medium">
                  Luyện tập kỹ năng Nghe và Nói trực tiếp với AI. AI sẽ giúp bạn sửa lỗi phát âm và ngữ pháp ngay lập tức.
                </p>
              </div>
              <button 
                onClick={startSession}
                disabled={isConnecting}
                className="px-8 py-4 bg-primary text-on-primary rounded-full font-headline font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isConnecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-on-primary" />}
                Bắt đầu ngay
              </button>
            </div>
          )}

          {transcription.map((line, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: line.startsWith('Bạn') ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${line.startsWith('Bạn') ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                line.startsWith('Bạn') 
                  ? 'bg-primary text-on-primary rounded-tr-none' 
                  : 'bg-surface-container-high text-on-surface rounded-tl-none'
              }`}>
                {line.replace(/^(Bạn|AI): /, '')}
              </div>
            </motion.div>
          ))}
          
          {aiResponse && (
            <div className="flex justify-start">
               <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium bg-surface-container-high text-on-surface rounded-tl-none animate-pulse">
                {aiResponse}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="p-6 bg-surface-container-low border-t border-surface-container-highest flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-error/20 text-error' : 'bg-primary shadow-lg shadow-primary/30 text-on-primary scale-110'}`}>
                  {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </div>
                <button 
                  onClick={stopSession}
                  className="w-12 h-12 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center hover:bg-error hover:text-white transition-all"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {isMuted ? 'Đã tắt mic' : 'Đang lắng nghe... Hãy nói gì đó bằng tiếng Trung!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
