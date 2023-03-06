import { QueryClient, QueryClientProvider } from 'react-query';
import { LoadingSpinnerProvider } from './Spinner';
import InfinityScroll from './InfinityScroll';
import VirtualInfinity from './VirtualInfinity';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingSpinnerProvider>
        <div className="container">
          <div className="my-3">
            <InfinityScroll />
          </div>
          <div className="my-3">
            <VirtualInfinity />
          </div>
        </div>
      </LoadingSpinnerProvider>
    </QueryClientProvider>
  );
}

export default App;
