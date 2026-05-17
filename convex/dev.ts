import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

/**
 * Wipes `scans` and `aiInsightsCache` for local/dev resets.
 * Set `DEV_DATA_RESET_SECRET` in Convex env (same value as Next `.env.local` if you call from a script).
 */
export const clearAllTablesForDev = mutationGeneric({
  args: { secret: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const expected = process.env.DEV_DATA_RESET_SECRET;
    if (!expected || args.secret !== expected) {
      throw new Error("Forbidden");
    }

    const scans = await ctx.db.query("scans").collect();
    for (const doc of scans) {
      await ctx.db.delete(doc._id);
    }
    const cacheRows = await ctx.db.query("aiInsightsCache").collect();
    for (const doc of cacheRows) {
      await ctx.db.delete(doc._id);
    }

    return null;
  },
});
