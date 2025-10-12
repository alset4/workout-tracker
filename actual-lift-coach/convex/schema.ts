import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workouts: defineTable({
    name: v.string(),
    completedAt: v.optional(v.number()),
  }),

  exercises: defineTable({
    name: v.string(),
    type: v.union(v.literal("hypertrophy"), v.literal("strength")),
    muscleGroup: v.array(
      v.union(
        v.literal("Chest"),
        v.literal("Triceps"),
        v.literal("Biceps"),
        v.literal("Front Head of Shoulder"),
        v.literal("Side Head of Shoulder"),
        v.literal("Rear head of Shoulder"),
        v.literal("Traps"),
        v.literal("Quads"),
        v.literal("Calfs"),
        v.literal("Glutes"),
        v.literal("Abs"),
        v.literal("Back"),
        v.literal("Forearms"),
        v.literal("Hips"),
        v.literal("Lower back"),
        v.literal("Neck"),
        v.literal("Hamstring")
      )
    ),
  }),

  workoutExercises: defineTable({
    workoutId: v.id("workouts"),
    exerciseIds: v.array(v.id("exercises")),
  }).index("by_workout", ["workoutId"]),

  sets: defineTable({
    workoutExerciseId: v.id("workoutExercises"),
    setIndex: v.number(),
    reps: v.number(),
    rest: v.number(),
    weight: v.number(),
    rpe: v.number(),
  }).index("by_workout_exercise", ["workoutExerciseId"]),
});
