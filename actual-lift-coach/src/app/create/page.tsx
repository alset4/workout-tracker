"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const MUSCLE_GROUPS = [
  "Chest",
  "Triceps",
  "Biceps",
  "Front Head of Shoulder",
  "Side Head of Shoulder",
  "Rear head of Shoulder",
  "Traps",
  "Quads",
  "Calfs",
  "Glutes",
  "Abs",
  "Back",
  "Forearms",
  "Hips",
  "Lower back",
  "Neck",
  "Hamstring",
];

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"workout" | "exercise">("workout");

  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseType, setExerciseType] = useState<"hypertrophy" | "strength">("hypertrophy");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [sets, setSets] = useState<
    Array<{ setIndex: number; reps: number; rest: number; weight: number }>
  >([{ setIndex: 1, reps: 0, rest: 90, weight: 0 }]);

  const [selectedExercises, setSelectedExercises] = useState<Id<"exercises">[]>([]);

  const createWorkout = useMutation(api.workouts.createWorkout);
  const createExercise = useMutation(api.exercises.createExercise);
  const exercises = useQuery(api.exercises.getExercises);

  const toggleMuscle = (muscle: string) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const addSet = () => {
    setSets([
      ...sets,
      { setIndex: sets.length + 1, reps: 0, rest: 90, weight: 0 },
    ]);
  };

  const updateSet = (index: number, field: string, value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const handleCreateExercise = async () => {
    if (!exerciseName || selectedMuscles.length === 0) {
      alert("Please fill in exercise name and select at least one muscle group");
      return;
    }

    const exerciseId = await createExercise({
      name: exerciseName,
      type: exerciseType,
      muscleGroup: selectedMuscles,
    });

    setSelectedExercises([...selectedExercises, exerciseId]);

    setExerciseName("");
    setSelectedMuscles([]);
    setSets([{ setIndex: 1, reps: 0, rest: 90, weight: 0 }]);
    setStep("workout");
  };

  const handleCreateWorkout = async () => {
    if (!workoutName || selectedExercises.length === 0) {
      alert("Please enter workout name and add at least one exercise");
      return;
    }

    await createWorkout({
      name: workoutName,
      exerciseIds: selectedExercises,
    });

    router.push("/");
  };

  if (step === "exercise") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Exercise</h1>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Exercise Name</label>
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Bench Press"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setExerciseType("hypertrophy")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    exerciseType === "hypertrophy"
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Hypertrophy
                </button>
                <button
                  onClick={() => setExerciseType("strength")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    exerciseType === "strength"
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Strength
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Muscle Groups</label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {MUSCLE_GROUPS.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedMuscles.includes(muscle)
                        ? "bg-green-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep("workout")}
              className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateExercise}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Add Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Workout</h1>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Workout Name</label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Push Day 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Selected Exercises ({selectedExercises.length})
            </label>
            {selectedExercises.length > 0 && exercises ? (
              <div className="space-y-2">
                {selectedExercises.map((id, index) => {
                  const exercise = exercises.find((e) => e._id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                    >
                      <span>{exercise?.name || "Unknown"}</span>
                      <button
                        onClick={() =>
                          setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
                        }
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No exercises added yet</p>
            )}
          </div>

          <button
            onClick={() => setStep("exercise")}
            className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            Add New Exercise
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateWorkout}
            className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Create Workout
          </button>
        </div>
      </div>
    </div>
  );
}
