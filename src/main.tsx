import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import '@rainbow-me/rainbowkit/styles.css';
import './main.css'

const queryClient = new QueryClient();
import { config } from './wagmi';

ReactDOM.createRoot(document.getElementById('root')!).render(


    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={router} />        
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>

)
