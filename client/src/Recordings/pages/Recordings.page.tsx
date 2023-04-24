import { Page, Tile, Container, Box, Icon } from '@tjallingf/react-utils';
import { useQuery } from '@tanstack/react-query';

const Recordings: React.FunctionComponent = () => {
  const { data: devices } = useQuery<any[]>(['devices']);

  const renderDevices = () => {
    return devices?.map((props) => {
      if (props.options?.recording?.enabled !== true) return null;
      return (
        <Tile>
          <Box className="p-1">
            <Icon id={props.icon} size={20} />
          </Box>
        </Tile>
      );
    });
  };

  return (
    <Page id="recordings">
      <Container>
        <Box direction="column" gutterY={2}>
          {renderDevices()}
        </Box>
      </Container>
    </Page>
  );
};

export default Recordings;
