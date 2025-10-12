"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const workouts = useQuery(api.workouts.getWorkouts);

  const presetWorkouts = [
    "push1",
    "pull1",
    "legs1",
    "push2",
    "pull2",
    "legs2",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Lift Coach</h1>
          <p className="text-gray-400">Choose your workout</p>
        </div>

        <div className="space-y-4">
          {presetWorkouts.map((workout) => (
            <Link
              key={workout}
              href={`/workout/${workout}`}
              className="block w-full py-4 px-6 text-center text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {workout.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="pt-8">
          <Link
            href="/create"
            className="block w-full py-4 px-6 text-center text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Create New Lift
          </Link>
        </div>
      </div>
    </div>
  );
}
