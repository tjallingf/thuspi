import { Page } from '@tjallingf/react-utils';
import FlowWorkspace from '../components/FlowWorkspace/FlowWorkspace';
import { useParams } from 'react-router-dom';

const FlowEdit: React.FunctionComponent = () => {
  const { id } = useParams();

  return (
    <Page id="FlowEdit">
      <FlowWorkspace id={parseFloat(id)} />
    </Page>
  );
};

export default FlowEdit;
