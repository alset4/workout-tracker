import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workouts: defineTable({
    name: v.string(),
    exercises: v.array(
      v.object({
        name: v.string(),
        type: v.union(v.literal("hypertrophy"), v.literal("strength")),
        muscleGroup: v.array(v.string()),
        sets: v.array(
          v.object({
            reps: v.number(),
            rest: v.number(),
            weight: v.optional(v.number()),
          })
        ),
      })
    ),
  }),

  completedWorkouts: defineTable({
    workoutId: v.id("workouts"),
    workoutName: v.string(),
    completedAt: v.number(),
    exercises: v.array(
      v.object({
        name: v.string(),
        type: v.union(v.literal("hypertrophy"), v.literal("strength")),
        muscleGroup: v.array(v.string()),
        completedSets: v.array(
          v.object({
            reps: v.number(),
            rest: v.number(),
            weight: v.number(),
            rpe: v.number(),
          })
        ),
      })
    ),
  }).index("by_workout", ["workoutId"]),
});
