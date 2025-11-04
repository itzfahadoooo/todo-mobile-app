import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    dueDate: v.optional(v.string()),
    createdAt: v.number(),
    order: v.number(),
  }).index("by_creation", ["createdAt"]),
});