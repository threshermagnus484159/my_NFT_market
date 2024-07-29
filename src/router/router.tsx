import { createBrowserRouter } from "react-router-dom";
import App from "../components/app/app";
import Swap from "../components/uniswap/uniswap";
import Nft_list from "../components/ntf-list/nft_list";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/uniswap",
        element: <Swap />,
      },
      {
        index: true,
        element: <Nft_list />,
      },
    ],
  },

]);

export default router;