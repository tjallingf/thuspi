import { Page } from '@tjallingf/react-utils';
import { useParams } from 'react-router-dom';
import { lazy } from 'react';
const FlowBlocklyEditor = lazy(() => import('../components/FlowBlocklyEditor'));

const FlowEdit: React.FunctionComponent = () => {
    const { id } = useParams();

    return (
        <Page id="FlowEdit">
            <FlowBlocklyEditor />
        </Page>
    );
};

export default FlowEdit;
