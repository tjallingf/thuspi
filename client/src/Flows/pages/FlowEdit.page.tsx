import { Page } from '@tjallingf/react-utils';
import { useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/ErrorBoundary';
import useQuery from '@/hooks/useQuery';
const FlowEditor = lazy(() => import('../components/FlowEditor'));

const FlowEdit: React.FunctionComponent = () => {
    const { id } = useParams();

    const blocks = useQuery<any[]>('flows/editor/blocks');
    const blockCategories = useQuery<any[]>('flows/editor/block-categories');
    if (blocks.isLoading) return <span>Loading blocks...</span>;

    if (blockCategories.isLoading) return <span>Loading block categories...</span>;

    return (
        <Page id="FlowEdit">
            <Suspense fallback={<span>Loading...</span>}>
                <FlowEditor flowId={id} blocks={blocks.result} blockCategories={blockCategories.result} />
            </Suspense>
        </Page>
    );
};

export default FlowEdit;
