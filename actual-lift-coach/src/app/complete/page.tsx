"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type PR = {
  exercise: string;
  weight: number;
  reps: number;
};

export default function CompletePage() {
  const router = useRouter();
  const [prs, setPrs] = useState<PR[]>([]);

  useEffect(() => {
    const mockPRs: PR[] = [
      { exercise: "Bench Press", weight: 195, reps: 5 },
      { exercise: "Squat", weight: 275, reps: 3 },
    ];
    setPrs(mockPRs);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🎉 Workout Complete! 🎉</h1>
          <p className="text-gray-400">Great job on finishing your workout!</p>
        </div>

        {prs.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">
              New Personal Records!
            </h2>
            <div className="space-y-3">
              {prs.map((pr, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{pr.exercise}</p>
                    <p className="text-sm text-gray-400">
                      {pr.reps} reps @ {pr.weight} lbs
                    </p>
                  </div>
                  <span className="text-3xl">🏆</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
