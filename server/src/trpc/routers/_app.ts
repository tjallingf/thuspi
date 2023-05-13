import { userRouter } from './user';
import { languageRouter } from './language';
import { deviceRouter } from './device';
import { authRouter } from './auth';
import { router, publicProcedure } from '../trpc';
import { flowEditorRouter } from './flowEditor';

export const appRouter = router({
    user: userRouter,
    language: languageRouter,
    device: deviceRouter,
    auth: authRouter,
    flowEditor: flowEditorRouter
});

export type AppRouter = typeof appRouter;