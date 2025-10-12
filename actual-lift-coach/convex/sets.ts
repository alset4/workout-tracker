import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSet = mutation({
  args: {
    workoutExerciseId: v.id("workoutExercises"),
    setIndex: v.number(),
    reps: v.number(),
    rest: v.number(),
    weight: v.number(),
    rpe: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sets", {
      workoutExerciseId: args.workoutExerciseId,
      setIndex: args.setIndex,
      reps: args.reps,
      rest: args.rest,
      weight: args.weight,
      rpe: args.rpe,
    });
  },
});

export const getSetsForWorkoutExercise = query({
  args: { workoutExerciseId: v.id("workoutExercises") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sets")
      .withIndex("by_workout_exercise", (q) =>
        q.eq("workoutExerciseId", args.workoutExerciseId)
      )
      .collect();
  },
});

export const getLastWeekSets = query({
  args: { exerciseId: v.id("exercises") },
  handler: async (ctx, args) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const workouts = await ctx.db
      .query("workouts")
      .filter((q) => q.gte(q.field("completedAt"), oneWeekAgo))
      .collect();

    const workoutIds = workouts.map((w) => w._id);

    const allWorkoutExercises = await Promise.all(
      workoutIds.map((wId) =>
        ctx.db
          .query("workoutExercises")
          .withIndex("by_workout", (q) => q.eq("workoutId", wId))
          .collect()
      )
    );

    const filteredWorkoutExercises = allWorkoutExercises
      .flat()
      .filter((we) => we.exerciseIds.includes(args.exerciseId));

    const allSets = await Promise.all(
      filteredWorkoutExercises.map((we) =>
        ctx.db
          .query("sets")
          .withIndex("by_workout_exercise", (q) =>
            q.eq("workoutExerciseId", we._id)
          )
          .collect()
      )
    );

    return allSets.flat();
  },
});

export const calculateSuggestion = query({
  args: { exerciseId: v.id("exercises") },
  handler: async (ctx, args) => {
    const exercise = await ctx.db.get(args.exerciseId);
    if (!exercise) return null;

    const lastWeekSets = await ctx.db
      .query("sets")
      .collect();

    if (lastWeekSets.length === 0) {
      return { weight: 45, reps: exercise.type === "hypertrophy" ? 8 : 3 };
    }

    const maxWeight = Math.max(...lastWeekSets.map((s) => s.weight));
    const maxWeightSets = lastWeekSets.filter((s) => s.weight === maxWeight);
    const maxReps = Math.max(...maxWeightSets.map((s) => s.reps));
    const repCounts = lastWeekSets.map((s) => s.reps);
    const mostCommonReps = repCounts.sort((a, b) =>
      repCounts.filter((v) => v === a).length - repCounts.filter((v) => v === b).length
    ).pop();

    if (exercise.type === "hypertrophy") {
      if ((mostCommonReps || 0) < 11) {
        return { weight: maxWeight, reps: maxReps + 2 };
      } else {
        return { weight: maxWeight + 5, reps: 8 };
      }
    } else {
      if ((mostCommonReps || 0) <= 4) {
        return { weight: maxWeight, reps: maxReps + 2 };
      } else {
        return { weight: maxWeight + 5, reps: 3 };
      }
    }
  },
});
