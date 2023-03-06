import { QueryClient, QueryClientProvider } from 'react-query';
import { LoadingSpinnerProvider } from './Spinner';
import InfinityScroll from './InfinityScroll';
import VirtualInfinity from './VirtualInfinity';
import PageNavigation from './PageNavigation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingSpinnerProvider>
        <div className="container my-5">
          <div className="my-3">
            <InfinityScroll />
          </div>
          <div className="my-3">
            <VirtualInfinity />
          </div>
          <div className="my-3">
            <PageNavigation />
          </div>
        </div>
      </LoadingSpinnerProvider>
    </QueryClientProvider>
  );
}

export default App;
