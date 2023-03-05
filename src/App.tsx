import { QueryClient, QueryClientProvider } from 'react-query';
import { LoadingSpinnerProvider } from './Spinner';
import InfinityScroll from './InfinityScroll';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingSpinnerProvider>
        <div className="container">
          <div className="row mt-3">
            <div className="col-6">
              <InfinityScroll />
            </div>
            <div className="col-6"></div>
          </div>
          <div className="row mt-3">
            <div className="col-6"></div>
          </div>
        </div>
      </LoadingSpinnerProvider>
    </QueryClientProvider>
  );
}

export default App;
