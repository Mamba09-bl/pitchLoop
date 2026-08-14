"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PersonasPage() {
  const [persona, setPersonas] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPersonas = async () => {
      const res = await fetch("/api/personas");
      const result = await res.json();
      console.log(result);

      setPersonas(result?.persona);
    };

    fetchPersonas();
  }, []);

  useEffect(() => {
    console.log(persona?._id);
  }, [persona]);

  const handleStartCall = async (personaId) => {
    const res = await fetch("/api/start-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: personaId,
        mode: "voice",
      }),
    });
    console.log("i am id", personaId);

    const result = await res.json();
    console.log(result);

    // move to voice page with session + persona
    // router.push(
    //   `/voice?personaId=${personaId}&sessionId=${result.session._id}`,
    // );
    router.push(`/voice/${result.sessionId}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Choose Persona</h1>

      <div className="grid grid-cols-3 gap-6">
        <div key={persona?._id} className="border rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-bold">{persona?.name}</h2>

          <p>{persona?.job}</p>

          <p>{persona?.company}</p>

          <p>{persona?.personality}</p>

          <p>{persona?.difficulty}</p>

          <button
            disabled={!persona?._id}
            onClick={() => handleStartCall(persona?._id)}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Start Voice Call
          </button>
        </div>
      </div>
    </div>
  );
}
