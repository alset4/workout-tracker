import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createExercise = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("hypertrophy"), v.literal("strength")),
    muscleGroup: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const exerciseId = await ctx.db.insert("exercises", {
      name: args.name,
      type: args.type,
      muscleGroup: args.muscleGroup,
    });

    return exerciseId;
  },
});

export const getExercises = query({
  handler: async (ctx) => {
    return await ctx.db.query("exercises").collect();
  },
});
