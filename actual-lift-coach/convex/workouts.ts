import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorkout = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const workoutId = await ctx.db.insert("workouts", {
      name: args.name,
      exercises: args.exercises as any,
    });

    return workoutId;
  },
});

export const getWorkouts = query({
  handler: async (ctx) => {
    return await ctx.db.query("workouts").collect();
  },
});

export const getWorkoutWithExercises = query({
  args: { workoutId: v.id("workouts") },
  handler: async (ctx, args) => {
    const workout = await ctx.db.get(args.workoutId);
    return workout;
  },
});

export const completeWorkout = mutation({
  args: {
    workoutId: v.id("workouts"),
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
  },
  handler: async (ctx, args) => {
    const workout = await ctx.db.get(args.workoutId);
    if (!workout) throw new Error("Workout not found");

    await ctx.db.insert("completedWorkouts", {
      workoutId: args.workoutId,
      workoutName: workout.name,
      completedAt: Date.now(),
      exercises: args.exercises as any,
    });
  },
});
