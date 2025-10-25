"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [numSets, setNumSets] = useState(3);
  const [useExistingExercise, setUseExistingExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");

  const [selectedExercises, setSelectedExercises] = useState<
    Array<{
      name: string;
      type: "hypertrophy" | "strength";
      muscleGroup: string[];
      sets: Array<{ reps: number; rest: number; weight?: number }>;
    }>
  >([]);

  const createWorkout = useMutation(api.workouts.createWorkout);
  const existingExercises = useQuery(api.exercises.getExercises);

  const toggleMuscle = (muscle: string) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const handleCreateExercise = () => {
    if (useExistingExercise) {
      if (!selectedExerciseId) {
        alert("Please select an exercise");
        return;
      }

      const exercise = existingExercises?.find((ex) => ex._id === selectedExerciseId);
      if (!exercise) return;

      const sets = Array.from({ length: numSets }, () => ({
        reps: 0,
        rest: 90,
        weight: 0,
      }));

      setSelectedExercises([
        ...selectedExercises,
        {
          name: exercise.name,
          type: exercise.type,
          muscleGroup: exercise.muscleGroup,
          sets,
        },
      ]);
    } else {
      if (!exerciseName || selectedMuscles.length === 0) {
        alert("Please fill in exercise name and select at least one muscle group");
        return;
      }

      const sets = Array.from({ length: numSets }, () => ({
        reps: 0,
        rest: 90,
        weight: 0,
      }));

      setSelectedExercises([
        ...selectedExercises,
        {
          name: exerciseName,
          type: exerciseType,
          muscleGroup: selectedMuscles,
          sets,
        },
      ]);
    }

    setExerciseName("");
    setSelectedMuscles([]);
    setSelectedExerciseId("");
    setUseExistingExercise(false);
    setNumSets(3);
    setStep("workout");
  };

  const handleCreateWorkout = async () => {
    if (!workoutName || selectedExercises.length === 0) {
      alert("Please enter workout name and add at least one exercise");
      return;
    }

    await createWorkout({
      name: workoutName,
      exercises: selectedExercises,
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
              <label className="block text-sm font-medium mb-2">Exercise Source</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setUseExistingExercise(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    !useExistingExercise
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Create New
                </button>
                <button
                  onClick={() => setUseExistingExercise(true)}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    useExistingExercise
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Use Existing
                </button>
              </div>
            </div>

            {useExistingExercise ? (
              <div>
                <label className="block text-sm font-medium mb-2">Select Exercise</label>
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose an exercise...</option>
                  {existingExercises?.map((exercise) => (
                    <option key={exercise._id} value={exercise._id}>
                      {exercise.name} ({exercise.type})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
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
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Number of Sets</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numSets}
                onChange={(e) => setNumSets(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            {selectedExercises.length > 0 ? (
            {selectedExercises.length > 0 ? (
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                  >
                    <div>
                      <span className="font-semibold">{exercise.name}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        ({exercise.sets.length} sets)
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
                      }
                      className="text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
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
