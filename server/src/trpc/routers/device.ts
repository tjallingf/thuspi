import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import Device from '../../zylax/devices/Device';
import { type GetTPropsSerialized } from '../../zylax/types';

export const deviceRouter = router({
    list: publicProcedure
        .query(async ({ ctx }): Promise<GetTPropsSerialized<Device>[]> => {
            return await ctx.getCollection(Device, (d) => {
                return ctx.user.hasPermission(`devices.read.${d.getId()}`);
            });
        }),

    get: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .query(async ({ ctx, input }): Promise<GetTPropsSerialized<Device>> => {  
            ctx.requirePermission(`devices.read.${input.id}`);
            return await ctx.getDocumentOrThrow(Device, input.id);
        }),

    input: publicProcedure
        .input(z.object({
            id: z.number(),
            values: z.array(
                z.object({
                    name: z.string(),
                    value: z.any()
                })
            )
        }))
        .mutation(({ ctx, input }) => {
            const device = ctx.getDocumentOrThrow(Device, input.id);
        })
})