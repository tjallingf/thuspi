import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import Language from '../../zylax/localization/Language';
import { GetSerializedProps } from '../../types';

export const languageRouter = router({
    get: publicProcedure
        .input(z.object({
            key: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<GetSerializedProps<Language>> => {    
            return await ctx.getDocumentOrThrow(Language, input.key);
        }),
})