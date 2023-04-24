import { LoadingIcon } from '@tjallingf/react-utils';
import useQuery from '@/hooks/useQuery';
import './DeviceDisplayRecord.scss';

export interface IDeviceDisplayRecordProps {
  id: number;
  display: {
    recording: {
      field: string;
    };
  };
  deviceColor: string;
}

const DeviceDisplayRecord: React.FunctionComponent<IDeviceDisplayRecordProps> = ({ id }) => {
  const { result, aggregation, isLoading } = useQuery<any[]>(`devices/${id}/records?top=1`);

  const getLatestValues = () => {
    if (isLoading) return <LoadingIcon />;

    const { config } = aggregation;

    const record = result[0];
    if (!record) return null;

    // Resolve the aliases

    return <span>{record.f[config.fields['b'].alias]}</span>;
  };

  return (
    <div className="DeviceDisplayRecord px-2 py-1">
      <div className="DeviceDisplayRecord__field">
        <span className="DeviceDisplayRecord__field__value">{getLatestValues()}</span>
      </div>
    </div>
  );
};

export default DeviceDisplayRecord;
