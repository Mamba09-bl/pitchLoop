"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import SessionCompleted from "@/components/SessionCompleted";
import LimitReachedCom from "@/components/limitedReached";
import AppShell from "@/components/app/AppShell";
import BackLink from "@/components/app/BackLink";
import StepRail from "@/components/app/StepRail";
import BuyerBriefPanel from "@/components/pre-call/BuyerBriefPanel";
import CallConsole from "@/components/voice/CallConsole";

const EASE = [0.22, 0.9, 0.24, 1];

const CALL_STEPS = [
  { label: "Persona", state: "done" },
  { label: "Call brief", state: "done" },
  { label: "Live call", state: "current" },
];

export default function VoicePage() {
  const [callActive, setCallActive] = useState(false);
  const [persona, setPersonas] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [warnUser, setWarnUser] = useState(false);
  const [sessionInstructions, setSessionInstructions] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [limitOver, setLimiteOver] = useState(false);
  const [callLimitReached, setCallLimitReached] = useState(false);
  const [callPhase, setCallPhase] = useState("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSilenceWarning, setShowSilenceWarning] = useState(false);
  const params = useParams();
  const sessionId = params.sessionId;
  const voiceId = params.sessionId;
  const timerIntervalRef = useRef(null);

  const socketRef = useRef(null);
  const outputAudioContextRef = useRef(null); // AI voice player
  const nextPlayTimeRef = useRef(0); // queue next chunk
  const playedAudioMsRef = useRef(0);
  const transcriptRef = useRef([]);
  const recordedChunksRef = useRef([]);
  const pendingEndCallRef = useRef(false);
  const hangupAudioRef = useRef(null);
  const isProcessingRef = useRef(false);
  const canStreamRef = useRef(false);
  const lastBuyerMessageRef = useRef("");
  const currentSourcesRef = useRef([]);
  const currentAssistantItemIdRef = useRef(null);
  const backendEvaluationInFlightRef = useRef(false);
  const lastSpeechTimeRef = useRef(Date.now());
  const silenceCheckerRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const micStreamRef = useRef(null);
  const responseActiveRef = useRef(false);
  const isEvaluatingRef = useRef(false); // Backend /api/transcribe is running
  const isAIRespondingRef = useRef(false); // OpenAI is generating/speaking
  const shouldStreamMicRef = useRef(true); // Should onaudioprocess send audio?
  const silenceTimerRef = useRef(null);
  const silenceWarningTimerRef = useRef(null);

  const router = useRouter();
  useEffect(() => {
    const fetchPersonas = async () => {
      const res = await fetch("/api/allPersona");
      const result = await res.json();

      // setPersonas(result?.persona);
    };

    fetchPersonas();
  }, []);

  useEffect(() => {
    hangupAudioRef.current = new Audio(
      "/freesound_community-shao_isabelle_2014_2015_hangup-104402.mp3",
    );
  }, []);

  // Call timer — purely presentational, mirrors callActive.
  useEffect(() => {
    if (callActive) {
      queueMicrotask(() => setElapsedSeconds(0));
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [callActive]);

  const fetchSession = async () => {
    const res = await fetch(`/api/transcribe?sessionId=${sessionId}`);
    const result = await res.json();

    setCurrentStage(result?.currentStage || null);
    setWarnUser(Boolean(result?.warning));
    setSessionInstructions(result?.instructions || "");
    setPersonas(result?.personaDetails);
    if (result.sessionEnded) {
      setTimeout(() => {
        setSessionEnded(true);
      }, 2000);

      return;
    }

    if (result?.limitReached) {
      setLimiteOver(true);
    }

    return result?.instructions || "";
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const evaluateTurnAndRespond = async ({
    transcriptText,
    formData,
    buyerMessage,
  }) => {
    if (!persona || !socketRef.current) return null;

    if (backendEvaluationInFlightRef.current) return null;

    backendEvaluationInFlightRef.current = true;
    isEvaluatingRef.current = true;
    shouldStreamMicRef.current = false;
    canStreamRef.current = false;
    setCallPhase("processing");

    try {
      const requestOptions = {
        method: "POST",
        headers: undefined,
      };

      if (formData) {
        requestOptions.body = formData;
      } else {
        requestOptions.headers = {
          "Content-Type": "application/json",
        };
        requestOptions.body = JSON.stringify({
          text: transcriptText,
          id: persona._id,
          idSession: sessionId,
          buyerMessage: lastBuyerMessageRef.current,
        });
      }

      const res = await fetch("/api/transcribe", requestOptions);
      const result = await res.json();

      if (result?.currentStage) {
        setCurrentStage(result.currentStage);
      }

      setWarnUser(Boolean(result?.warning));

      if (result?.ended) {
        pendingEndCallRef.current = true;
      }

      transcriptRef.current.push({
        role: "user",
        text: result?.text || transcriptText,
      });

      if (result?.instructions) {
        setSessionInstructions(result.instructions);

        socketRef.current.send(
          JSON.stringify({
            type: "session.update",
            session: {
              type: "realtime",
              instructions: result.instructions,
            },
          }),
        );
      }

      // socketRef.current.send(
      //   JSON.stringify({
      //     type: "input_audio_buffer.commit",
      //   }),
      // );

      socketRef.current.send(
        JSON.stringify({
          type: "response.create",
        }),
      );
      return result;
    } finally {
      backendEvaluationInFlightRef.current = false;
      isEvaluatingRef.current = false;
      shouldStreamMicRef.current = true;
      canStreamRef.current = true;
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(silenceTimerRef.current);
      clearTimeout(silenceWarningTimerRef.current);
    };
  }, []);

  if (sessionEnded) {
    return (
      <SessionCompleted
        onViewFeedback={() => router.push(`/voice-feedback/${voiceId}`)}
        onStartNew={() => router.push("/personas")}
        onBackToPersonas={() => router.push("/personas")}
      />
    );
  }

  if (limitOver) {
    return <LimitReachedCom />;
  }

  const startSilenceTimer = () => {
    clearTimeout(silenceTimerRef.current);
    clearTimeout(silenceWarningTimerRef.current);
    setShowSilenceWarning(false);

    silenceTimerRef.current = setTimeout(() => {
      // User has been silent for 10 seconds — warn before auto-ending
      setShowSilenceWarning(true);

      silenceWarningTimerRef.current = setTimeout(() => {
        // Silent for 15 seconds total → end call
        endCall();
      }, 10000);
    }, 15000);
  };
  async function startCall() {
    startSilenceTimer();
    setCallPhase("connecting");
    const instructions = await fetchSession();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: true,
      },
    });
    micStreamRef.current = stream;

    const realtimeSessionRes = await fetch("/api/realtime-session", {
      method: "POST",
    });
    if (!realtimeSessionRes.ok) {
      throw new Error("Failed to obtain Realtime session credential");
    }
    const { value: ephemeralKey } = await realtimeSessionRes.json();

    const socket = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-realtime-1.5",
      ["realtime", `openai-insecure-api-key.${ephemeralKey}`],
    );

    socketRef.current = socket;

    // 2 create recorder
    const mediaRecorder = new MediaRecorder(stream);

    recordedChunksRef.current = [];

    // 3 collect chunks
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(recordedChunksRef.current, {
        type: "audio/webm",
      });

      recordedChunksRef.current = [];

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("id", persona._id);
      formData.append("idSession", sessionId);
      formData.append("buyerMessage", lastBuyerMessageRef.current);

      // Pause realtime generation first, then wait for the backend to finish evaluating the turn.

      // recordedChunksRef.current = [];
      await evaluateTurnAndRespond({
        formData,
        buyerMessage: lastBuyerMessageRef.current,
      });

      // isProcessingRef.current = false;
      mediaRecorder.start();
      // startSilenceChecker();
    };

    // 5 start recording

    mediaRecorder.start();

    lastSpeechTimeRef.current = Date.now();
    // startSilenceChecker();

    // function startSilenceChecker() {
    //   console.log("Silence checker started");
    //   clearInterval(silenceCheckerRef.current);

    //   silenceCheckerRef.current = setInterval(() => {
    //     const silenceDuration = Date.now() - lastSpeechTimeRef.current;
    //     console.log("checking", silenceDuration);
    //     if (silenceDuration > 4000) {
    //       console.log("Stopping recorder");

    //       clearInterval(silenceCheckerRef.current);
    //       silenceCheckerRef.current = null;
    //       console.log(mediaRecorder.state);

    //       mediaRecorder.stop();
    //     }
    //   }, 500);
    // }

    outputAudioContextRef.current = new AudioContext({
      sampleRate: 24000,
    });

    canStreamRef.current = false;

    socket.onopen = async () => {
      socket.send(
        JSON.stringify({
          type: "session.update",
          session: {
            type: "realtime",

            instructions,

            audio: {
              input: {
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.65,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 500,

                  // IMPORTANT FOR YOUR ARCHITECTURE
                  create_response: false,

                  interrupt_response: true,
                },
              },
            },
          },
        }),
      );

      // 2. Prepare microphone pipeline
      const audioContext = new AudioContext({
        sampleRate: 24000,
      });

      const source = audioContext.createMediaStreamSource(micStreamRef.current);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (event) => {
        // Don't send until session.updated
        if (!canStreamRef.current) return;

        if (!shouldStreamMicRef.current) return;

        const inputData = event.inputBuffer.getChannelData(0);

        const pcm16 = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
        }

        const base64Audio = btoa(
          String.fromCharCode(...new Uint8Array(pcm16.buffer)),
        );

        socket.send(
          JSON.stringify({
            type: "input_audio_buffer.append",
            audio: base64Audio,
          }),
        );
      };
    };

    socket.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "session.updated") {
        canStreamRef.current = true;
        setCallPhase("listening");
      }

      if (data.type === "response.created") {
        responseActiveRef.current = true;
        isAIRespondingRef.current = true;
        setCallPhase("ai-speaking");
      }

      if (data.type === "response.done") {
        responseActiveRef.current = false;
        isAIRespondingRef.current = false;
        setCallPhase((p) => (p === "ai-speaking" ? "listening" : p));
      }

      // if (data.type.includes("transcript")) {
      //   console.log("hehe", data);
      //   console.log("hello", JSON.stringify(data, null, 2));
      // }

      if (data.type === "error") {
        console.error("OPENAI ERROR:", data.error?.code, data.error?.message);
      }
      if (data.type.includes("session")) {
        // console.log("SESSION EVENT:", data);
      }

      let silenceTimer;

      if (data.type === "input_audio_buffer.speech_started") {
        clearTimeout(silenceTimerRef.current);
        clearTimeout(silenceWarningTimerRef.current);
        setShowSilenceWarning(false);
        setCallPhase("user-speaking");
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        if (responseActiveRef.current) {
          socket.send(
            JSON.stringify({
              type: "response.cancel",
            }),
          );

          responseActiveRef.current = false;
        }

        if (currentAssistantItemIdRef.current) {
          socket.send(
            JSON.stringify({
              type: "conversation.item.truncate",
              item_id: currentAssistantItemIdRef.current,
              content_index: 0,
              audio_end_ms: playedAudioMsRef.current,
            }),
          );
        }
        for (const source of currentSourcesRef.current) {
          try {
            source.stop(0);
            source.disconnect();
          } catch {}
        }

        currentSourcesRef.current = [];
        playedAudioMsRef.current = 0;
        nextPlayTimeRef.current = outputAudioContextRef.current.currentTime;
        currentAssistantItemIdRef.current = null;
        // outputAudioContextRef.current = new AudioContext({
        //   sampleRate: 24000,
        // });

        playedAudioMsRef.current = 0;

        nextPlayTimeRef.current = outputAudioContextRef.current.currentTime;
        currentAssistantItemIdRef.current = null;
      }

      if (data.type === "response.output_audio.delta") {
        if (
          currentAssistantItemIdRef.current &&
          data.item_id !== currentAssistantItemIdRef.current
        ) {
          return;
        }
        // save current assistant message id
        if (!currentAssistantItemIdRef.current) {
          currentAssistantItemIdRef.current = data.item_id;
        }
        // decode base64 -> binary
        const binary = atob(data.delta);

        // binary -> PCM16
        const pcmData = new Int16Array(binary.length / 2);

        for (let i = 0; i < pcmData.length; i++) {
          pcmData[i] =
            binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
        }

        // PCM16 -> Float32
        const floatData = new Float32Array(pcmData.length);

        for (let i = 0; i < pcmData.length; i++) {
          floatData[i] = pcmData[i] / 0x7fff;
        }

        // make playable buffer
        const audioBuffer = outputAudioContextRef.current.createBuffer(
          1,
          floatData.length,
          24000,
        );

        audioBuffer.copyToChannel(floatData, 0);

        // source node
        const source = outputAudioContextRef.current.createBufferSource();
        source.onended = () => {
          currentSourcesRef.current = currentSourcesRef.current.filter(
            (s) => s !== source,
          );

          // if (
          //   pendingEndCallRef.current &&
          //   currentSourcesRef.current.length === 0
          // ) {
          //   pendingEndCallRef.current = false;
          //   endCall();
          // }
        };
        currentSourcesRef.current.push(source);

        source.buffer = audioBuffer;

        source.connect(outputAudioContextRef.current.destination);

        // if queue behind current time, reset it
        if (
          nextPlayTimeRef.current < outputAudioContextRef.current.currentTime
        ) {
          nextPlayTimeRef.current = outputAudioContextRef.current.currentTime;
        }

        // play chunk in order
        source.start(nextPlayTimeRef.current);

        // move queue forward
        nextPlayTimeRef.current += audioBuffer.duration;
        playedAudioMsRef.current += audioBuffer.duration * 1000;
      }

      if (data.type === "response.output_audio.done") {
        // Wait until all queued AI audio has actually finished playing
        const remainingTime =
          (nextPlayTimeRef.current -
            outputAudioContextRef.current.currentTime) *
          1000;

        if (pendingEndCallRef.current) {
          setTimeout(
            async () => {
              pendingEndCallRef.current = false;

              const finishEndCall = async () => {
                // Stop mic/socket/call
                endCall();

                // Mark session completed in backend
                try {
                  const res = await fetch("/api/voice-feedback", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: voiceId,
                    }),
                  });

                  if (!res.ok) {
                    console.error("Failed to end session");
                  }
                } catch (error) {
                  console.error("End session error:", error);
                }

                // Go to feedback AFTER session is completed
                router.push(`/voice-feedback/${voiceId}`);
              };

              // Play hangup sound (best-effort — the call must still end if this fails)
              try {
                hangupAudioRef.current.currentTime = 0;
                await hangupAudioRef.current.play();
                hangupAudioRef.current.onended = finishEndCall;
              } catch (error) {
                console.error("Hangup sound failed to play:", error);
                await finishEndCall();
              }
            },
            Math.max(0, remainingTime),
          );
        }

        currentSourcesRef.current = [];
        currentAssistantItemIdRef.current = null;
        playedAudioMsRef.current = 0;
      }

      if (data.type === "input_audio_buffer.speech_stopped") {
        // lastSpeechTimeRef.current = Date.now();
        // silenceTimer = setTimeout(() => {
        //   mediaRecorder.stop();
        // }, 4000);
        // mediaRecorder.stop();

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        // Wait 4 seconds before considering the seller's answer finished
        silenceTimeoutRef.current = setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }

          silenceTimeoutRef.current = null;
        }, 2000);
      }

      if (data.type === "response.output_item.done") {
        const buyerMessage = data.item?.content?.[0]?.transcript;
        if (data.type === "response.output_item.done") {
          const buyerMessage = data.item?.content?.[0]?.transcript;

          if (buyerMessage) {
            lastBuyerMessageRef.current = buyerMessage;
          }
        }
        startSilenceTimer();
      }
    };

    setCallActive(true);
  }

  function endCall() {
    // if (micStreamRef.current) {
    //   micStreamRef.current.getTracks().forEach((track) => {
    //     track.stop();
    //   });

    //   micStreamRef.current = null;
    // }

    clearTimeout(silenceTimerRef.current);
    clearTimeout(silenceWarningTimerRef.current);
    setShowSilenceWarning(false);

    socketRef.current?.close();
    setCallActive(false);
    setCallPhase("idle");
  }

  async function handleStartCallClick() {
    try {
      const res = await fetch("/api/start-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: voiceId,
          personaId: persona._id,
        }),
      });
      const result = await res.json();

      if (result?.limitReached) {
        setCallLimitReached(true);
        return;
      }

      if (result?.checkCallNumber >= 2) {
        setCallLimitReached(true);
      }
    } catch (error) {
      console.error("End session error:", error);
      return;
    }
    startCall();
  }

  return (
    <AppShell>
      <section className="pb-6 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <BackLink onClick={() => router.push("/personas")}>
            Back to personas
          </BackLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 pl-label ${
                  callActive
                    ? "border-pl-gain/30 bg-pl-gain/10 text-pl-gain"
                    : "border-pl-rule-2 bg-pl-raised text-pl-mute"
                }`}
              >
                <span
                  className={`h-[6px] w-[6px] rounded-full ${callActive ? "bg-pl-gain" : "bg-pl-mute/60"}`}
                />
                {callActive ? "Live" : "Not connected"}
              </span>
            </div>
            <h1 className="pl-display mt-4 text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold text-pl-ink">
              Live call.
            </h1>
            <p className="mt-2.5 max-w-[52ch] text-[14px] leading-relaxed text-pl-body">
              {persona?.name
                ? `You're on the line with ${persona.name.split(" ")[0]}. Speak naturally — the buyer hears you live.`
                : "Setting up your call with the buyer."}
            </p>
          </div>
          <div className="shrink-0">
            <StepRail steps={CALL_STEPS} />
          </div>
        </motion.div>
      </section>

      <section className="pb-20 sm:pb-28">
        <AnimatePresence>
          {warnUser && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-[6px] border border-pl-alert/30 bg-pl-alert/[0.08] px-5 py-3.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-pl-alert" />
                <div>
                  <p className="text-[13px] font-semibold text-pl-alert">
                    Prospect losing patience
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-pl-alert/80">
                    Final warning — redirect the conversation immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSilenceWarning && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-[6px] border border-pl-alert/30 bg-pl-alert/[0.08] px-5 py-3.5">
                <MicOff className="mt-0.5 h-4 w-4 shrink-0 text-pl-alert" />
                <div>
                  <p className="text-[13px] font-semibold text-pl-alert">
                    Still there?
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-pl-alert/80">
                    You've gone quiet — say something in the next few seconds or
                    the call will end automatically.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {callActive && (
          <div className="mb-5 flex items-center gap-2 rounded-[6px] border border-pl-rule-2 bg-pl-raised px-4 py-2.5">
            <MicOff className="h-3.5 w-3.5 shrink-0 text-pl-mute" />
            <p className="text-[11.5px] text-pl-mute">
              Stay on the line — 15 seconds of silence ends the call
              automatically, and calls are limited per session.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          >
            <CallConsole
              persona={persona}
              callActive={callActive}
              callPhase={callPhase}
              currentStage={currentStage}
              elapsedSeconds={elapsedSeconds}
              onStart={handleStartCallClick}
              onEnd={endCall}
              limitReached={callLimitReached}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
          >
            <BuyerBriefPanel buyer={persona} />
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
