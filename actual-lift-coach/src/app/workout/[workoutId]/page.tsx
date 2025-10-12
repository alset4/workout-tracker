"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type ExerciseWithSets = {
  exercise: {
    _id: string;
    name: string;
    type: "hypertrophy" | "strength";
  };
  sets: Array<{
    setIndex: number;
    lastWeek: { reps: number; weight: number; rpe: number } | null;
    suggested: { reps: number; weight: number };
  }>;
};

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [rpe, setRpe] = useState("");
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const mockExercises: ExerciseWithSets[] = [
    {
      exercise: {
        _id: "example_id",
        name: "Bench Press",
        type: "strength",
      },
      sets: [
        {
          setIndex: 1,
          lastWeek: { reps: 5, weight: 185, rpe: 8 },
          suggested: { reps: 5, weight: 190 },
        },
        {
          setIndex: 2,
          lastWeek: { reps: 5, weight: 185, rpe: 8 },
          suggested: { reps: 5, weight: 190 },
        },
        {
          setIndex: 3,
          lastWeek: { reps: 4, weight: 185, rpe: 9 },
          suggested: { reps: 5, weight: 190 },
        },
      ],
    },
    {
      exercise: {
        _id: "example_id_2",
        name: "Incline Dumbbell Press",
        type: "hypertrophy",
      },
      sets: [
        {
          setIndex: 1,
          lastWeek: { reps: 10, weight: 70, rpe: 7 },
          suggested: { reps: 12, weight: 70 },
        },
        {
          setIndex: 2,
          lastWeek: { reps: 10, weight: 70, rpe: 8 },
          suggested: { reps: 12, weight: 70 },
        },
        {
          setIndex: 3,
          lastWeek: { reps: 9, weight: 70, rpe: 9 },
          suggested: { reps: 12, weight: 70 },
        },
      ],
    },
  ];

  const currentExercise = mockExercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];

  useEffect(() => {
    if (isTimerRunning && timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) {
      setIsTimerRunning(false);
    }
  }, [isTimerRunning, timer]);

  const handleNextSet = async () => {
    if (!reps || !weight || !rpe) {
      alert("Please fill in all fields");
      return;
    }

    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setReps("");
      setWeight("");
      setRpe("");
      setTimer(90);
      setIsTimerRunning(true);
    } else {
      handleNextExercise();
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < mockExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setReps("");
      setWeight("");
      setRpe("");
      setTimer(null);
      setIsTimerRunning(false);
    } else {
      router.push("/complete");
    }
  };

  const handleSkip = () => {
    handleNextExercise();
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Workout Complete!</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{currentExercise.exercise.name}</h1>
          <p className="text-gray-400 mt-2">
            Set {currentSetIndex + 1} of {currentExercise.sets.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Exercise {currentExerciseIndex + 1} of {mockExercises.length}
          </p>
        </div>

        {timer !== null && timer > 0 && (
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-400">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </div>
            <p className="text-gray-400 mt-2">Rest Timer</p>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Last Week</h3>
            {currentSet.lastWeek ? (
              <p className="text-gray-300">
                {currentSet.lastWeek.reps} reps @ {currentSet.lastWeek.weight} lbs
                (RPE: {currentSet.lastWeek.rpe})
              </p>
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Suggested</h3>
            <p className="text-green-400 font-bold">
              {currentSet.suggested.reps} reps @ {currentSet.suggested.weight} lbs
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reps</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reps"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">RPE (1-10)</label>
              <input
                type="number"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                min="1"
                max="10"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter RPE"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Skip Exercise
          </button>
          <button
            onClick={handleNextSet}
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            {currentSetIndex < currentExercise.sets.length - 1 ? "Next Set" : "Next Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
}
