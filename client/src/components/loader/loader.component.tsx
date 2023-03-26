import { SyncLoader } from 'react-spinners';
import { LoaderContainer } from './loader.styles';

function Loader() {
  return (
    <LoaderContainer>
      <h1>Loading</h1>

      <SyncLoader
        color="hsl(242, 48%, 58%)"
        aria-label="Loading Spinner"
      />
    </LoaderContainer>
  );
}

export default Loader;
