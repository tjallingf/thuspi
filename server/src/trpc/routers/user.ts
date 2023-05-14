import { router, publicProcedure } from '../trpc';
import User, { SerializedUserProps } from '../../zylax/users/User';
import { z } from 'zod';

export const userRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.union([ z.number(), z.literal('me') ])
        }))
        .query(async ({ ctx, input }): Promise<SerializedUserProps> => {
            let userId: number;
            
            if(input.id === 'me') {
                userId = ctx.user.getId();
            } else {
                ctx.requirePermission(`users.read.${input.id}`);
                userId = input.id;
            }
            
            return await ctx.getDocumentOrThrow(User, userId);
        }),
})