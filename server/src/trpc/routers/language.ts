import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import Language, { LanguagePropsSerialized } from '../../zylax/localization/Language';

export const languageRouter = router({
    get: publicProcedure
        .input(z.object({
            key: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<LanguagePropsSerialized> => {    
            return await ctx.getDocumentOrThrow(Language, input.key);
        }),
})