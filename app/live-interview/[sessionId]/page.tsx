"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

// ---------------------------
// SPEECH RECOGNITION (BROWSER STT)
// ---------------------------
const SpeechRecognition =
    typeof window !== "undefined"
        ? (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition
        : null;

let recognition: any = null;

// ---------------------------
// TEXT TO SPEECH
// ---------------------------
function speak(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
}

export default function LiveInterviewPage() {
    const params = useParams();
    const sessionId = params.sessionId;

    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [transcript, setTranscript] = useState<any[]>([]);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [feedback, setFeedback] = useState("");

    const questionsRef = useRef<string[]>([]);

    // ---------------------------------------------------
    // 1️⃣ LOAD INTERVIEW QUESTIONS FROM BACKEND
    // ---------------------------------------------------
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(
                    `/api/live-interview/next?sessionId=${sessionId}`
                );

                const text = await res.text();
                console.log("RAW RESPONSE:", text);

                if (!text || text.trim().length === 0) {
                    console.error("❌ API returned EMPTY response");
                    return;
                }

                let data;
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    console.error("❌ JSON parse failed:", err, "RAW:", text);
                    return;
                }

                if (!Array.isArray(data.questions)) {
                    console.error("❌ No questions array received");
                    return;
                }

                // Save questions
                questionsRef.current = data.questions;
                setCurrentQuestion(data.questions[0]);

                // Add first question to transcript
                setTranscript((prev) => [
                    ...prev,
                    { speaker: "Questa", text: data.questions[0] },
                ]);

                // Speak the first question
                speak(data.questions[0]);

                setLoading(false);
            } catch (error) {
                console.error("❌ Error loading questions:", error);
            }
        }

        load();
    }, [sessionId]);

    // ---------------------------------------------------
    // 2️⃣ START SPEECH RECOGNITION
    // ---------------------------------------------------
    function startListening() {
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in your browser.");
            return;
        }

        if (!recognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onresult = async (event: any) => {
                const userAnswer = event.results[0][0].transcript;

                setListening(false);

                // User transcript
                setTranscript((prev) => [
                    ...prev,
                    { speaker: "You", text: userAnswer },
                ]);

                // Save answer to backend
                await fetch("/api/live-interview/answer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        answer: userAnswer,
                        question: currentQuestion,
                    }),
                });

                goToNextQuestion();
            };

            recognition.onend = () => setListening(false);
        }

        setListening(true);
        recognition.start();
    }

    // ---------------------------------------------------
    // 3️⃣ MOVE TO NEXT QUESTION
    // ---------------------------------------------------
    async function goToNextQuestion() {
        const next = questionIndex + 1;

        if (next >= questionsRef.current.length) {
            finishInterview();
            return;
        }

        const nextQ = questionsRef.current[next];
        setQuestionIndex(next);
        setCurrentQuestion(nextQ);

        setTranscript((prev) => [
            ...prev,
            { speaker: "Questa", text: nextQ },
        ]);

        speak(nextQ);
    }

    // ---------------------------------------------------
    // 4️⃣ END INTERVIEW + GET FINAL FEEDBACK
    // ---------------------------------------------------
    async function finishInterview() {
        setFinished(true);
        speak("Thank you. Let me analyze your performance.");

        const res = await fetch("/api/live-interview/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        setFeedback(data.feedback);
        speak("Here is your performance summary.");
    }

    // ---------------------------------------------------
    // UI
    // ---------------------------------------------------
    if (loading) {
        return (
            <div className="text-white p-10 text-xl">
                Loading Interview...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-2">Live Interview</h1>
            <p className="text-gray-400 mb-6">Session ID: {sessionId}</p>

            {/* TRANSCRIPT */}
            <div className="flex-1 bg-neutral-900 p-5 rounded-lg overflow-y-auto mb-5">
                {transcript.map((line, i) => (
                    <div key={i} className="mb-3">
                        <p className="font-semibold">{line.speaker}:</p>
                        <p className="text-gray-300">{line.text}</p>
                    </div>
                ))}
            </div>

            {/* CURRENT QUESTION */}
            {!finished && (
                <div className="mb-5 text-xl font-semibold">
                    {currentQuestion}
                </div>
            )}

            {/* LISTEN BUTTON */}
            {!finished && (
                <button
                    onClick={startListening}
                    className={`w-full py-4 rounded-lg text-lg font-semibold ${
                        listening ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {listening ? "Listening..." : "Speak Answer"}
                </button>
            )}

            {/* FINAL FEEDBACK */}
            {finished && (
                <div className="bg-neutral-900 p-5 rounded-lg">
                    <h2 className="text-xl font-bold mb-3">Your Performance</h2>
                    <p className="text-gray-300 whitespace-pre-line">{feedback}</p>
                </div>
            )}
        </div>
    );
}
