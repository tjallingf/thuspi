import useQuery from '@/hooks/useQuery';
import { LoadingIcon } from '@tjallingf/react-utils';

export interface IFlowWorkspaceProps {
  id: number;
}

const FlowWorkspace: React.FunctionComponent<IFlowWorkspaceProps> = ({ id }) => {
  const { isLoading } = useQuery(`flows/${id}`);

  if (isLoading) return <LoadingIcon />;

  return <div className="FlowWorkspace"></div>;
};

export default FlowWorkspace;
