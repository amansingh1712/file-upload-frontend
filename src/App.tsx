import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position='bottom-center' toastOptions={{}} />
    </>
  );
}

export default App;
