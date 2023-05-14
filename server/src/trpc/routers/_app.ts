import { userRouter } from './user';
import { languageRouter } from './language';
import { deviceRouter } from './device';
import { authRouter } from './auth';
import { flowEditorRouter } from './flowEditor';
import { router } from '../trpc';
import { CreateRouterInner } from '@trpc/server';

export const appRouter = router({
    user: userRouter,
    language: languageRouter,
    device: deviceRouter,
    auth: authRouter,
    flowEditor: flowEditorRouter
});

export type AppRouter = typeof appRouter;