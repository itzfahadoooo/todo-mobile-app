import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all todos
export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db
      .query("todos")
      .order("desc")
      .collect();
    return todos;
  },
});

// Create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todos = await ctx.db.query("todos").collect();
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) : 0;
    
    const todoId = await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      completed: false,
      dueDate: args.dueDate,
      createdAt: Date.now(),
      order: maxOrder + 1,
    });
    return todoId;
  },
});

// Update a todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (todo) {
      await ctx.db.patch(args.id, { completed: !todo.completed });
    }
  },
});

// Delete a todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Update todo order (for drag and drop functionality)
export const updateTodoOrder = mutation({
  args: {
    todos: v.array(v.object({
      id: v.id("todos"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.todos.map(({ id, order }) =>
        ctx.db.patch(id, { order })
      )
    );
  },
});