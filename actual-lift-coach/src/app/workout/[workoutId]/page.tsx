"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Exercise = {
  name: string;
  type: "hypertrophy" | "strength";
  muscleGroup: string[];
  sets: Array<{
    reps: number;
    rest: number;
    weight?: number;
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

  const workout = useQuery(api.workouts.getWorkoutWithExercises, {
    workoutId: workoutId as Id<"workouts">,
  });
  const completeWorkout = useMutation(api.workouts.completeWorkout);

  const [completedExercises, setCompletedExercises] = useState<
    Array<{
      name: string;
      type: "hypertrophy" | "strength";
      muscleGroup: string[];
      completedSets: Array<{
        reps: number;
        rest: number;
        weight: number;
        rpe: number;
      }>;
    }>
  >([]);
  const [currentExerciseSets, setCurrentExerciseSets] = useState<
    Array<{ reps: number; rest: number; weight: number; rpe: number }>
  >([]);

  const currentExercise = workout?.exercises[currentExerciseIndex];
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
    if (!reps || !weight || !rpe || !currentExercise) {
      alert("Please fill in all fields");
      return;
    }

    const completedSet = {
      reps: parseInt(reps),
      rest: currentSet?.rest || 90,
      weight: parseInt(weight),
      rpe: parseInt(rpe),
    };

    setCurrentExerciseSets([...currentExerciseSets, completedSet]);

    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setReps("");
      setWeight("");
      setRpe("");
      setTimer(currentExercise.sets[currentSetIndex + 1]?.rest || 90);
      setIsTimerRunning(true);
    } else {
      handleNextExercise(completedSet);
    }
  };

  const handleNextExercise = async (lastSet?: {
    reps: number;
    rest: number;
    weight: number;
    rpe: number;
  }) => {
    if (!currentExercise) return;

    const allSets = lastSet ? [...currentExerciseSets, lastSet] : currentExerciseSets;

    const completedExercise = {
      name: currentExercise.name,
      type: currentExercise.type,
      muscleGroup: currentExercise.muscleGroup,
      completedSets: allSets,
    };

    const newCompletedExercises = [...completedExercises, completedExercise];
    setCompletedExercises(newCompletedExercises);
    setCurrentExerciseSets([]);

    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
      setReps("");
      setWeight("");
      setRpe("");
      setTimer(null);
      setIsTimerRunning(false);
    } else {
      await completeWorkout({
        workoutId: workoutId as Id<"workouts">,
        exercises: newCompletedExercises,
      });
      router.push("/");
    }
  };

  const handleSkip = () => {
    handleNextExercise();
  };

  const handlePreviousSet = () => {
    if (currentSetIndex > 0) {
      const previousSet = currentExerciseSets[currentExerciseSets.length - 1];
      setCurrentExerciseSets(currentExerciseSets.slice(0, -1));
      setCurrentSetIndex(currentSetIndex - 1);
      setReps(previousSet.reps.toString());
      setWeight(previousSet.weight.toString());
      setRpe(previousSet.rpe.toString());
      setTimer(null);
      setIsTimerRunning(false);
    } else if (completedExercises.length > 0) {
      const previousExercise = completedExercises[completedExercises.length - 1];
      setCompletedExercises(completedExercises.slice(0, -1));
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentExerciseSets(previousExercise.completedSets.slice(0, -1));
      setCurrentSetIndex(previousExercise.completedSets.length - 1);
      const lastSet = previousExercise.completedSets[previousExercise.completedSets.length - 1];
      setReps(lastSet.reps.toString());
      setWeight(lastSet.weight.toString());
      setRpe(lastSet.rpe.toString());
      setTimer(null);
      setIsTimerRunning(false);
    }
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
          <h1 className="text-3xl font-bold">{currentExercise?.name}</h1>
          <p className="text-gray-400 mt-2">
            Set {currentSetIndex + 1} of {currentExercise?.sets.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Exercise {currentExerciseIndex + 1} of {workout?.exercises.length}
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
            <h3 className="text-lg font-semibold mb-2">Target</h3>
            <p className="text-green-400 font-bold">
              {currentSet?.reps} reps @ {currentSet?.weight || 0} lbs
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Rest: {currentSet?.rest || 90}s
            </p>
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
        {(currentSetIndex > 0 || completedExercises.length > 0) && (
          <button
            onClick={handlePreviousSet}
            className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Previous
          </button>
        )}
      </div>
    </div>
  );
}
