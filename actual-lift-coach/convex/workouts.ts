import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorkout = mutation({
  args: {
    name: v.string(),
    exerciseIds: v.array(v.id("exercises")),
  },
  handler: async (ctx, args) => {
    const workoutId = await ctx.db.insert("workouts", {
      name: args.name,
    });

    await ctx.db.insert("workoutExercises", {
      workoutId,
      exerciseIds: args.exerciseIds,
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
    if (!workout) return null;

    const workoutExercise = await ctx.db
      .query("workoutExercises")
      .withIndex("by_workout", (q) => q.eq("workoutId", args.workoutId))
      .first();

    if (!workoutExercise) return { ...workout, exercises: [] };

    const exercises = await Promise.all(
      workoutExercise.exerciseIds.map((id) => ctx.db.get(id))
    );

    return { ...workout, exercises: exercises.filter((e) => e !== null) };
  },
});

export const completeWorkout = mutation({
  args: { workoutId: v.id("workouts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workoutId, {
      completedAt: Date.now(),
    });
  },
});
