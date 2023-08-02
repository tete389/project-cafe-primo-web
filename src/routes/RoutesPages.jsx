import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Error from "../pages/Error";
import EmployeeLayout from "../pages/employee/EmployeeLayout";
import Dashboard from "../pages/employee/Dashboard";
import Product from "../pages/Product";
import Order from "../pages/Order";
import EmpLogin from "../pages/employee/EmpLogin";

///

import ProtectRoute from "./ProtectRoute";

/////
import Store from "../pages/Store";
//import Menu, {loaderMenu as menuInCategory } from "../pages/Menu";
//import MenuPopup, {loaderMenuPopUp as menuOtion} from "../components/MenuPopup";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
    children: [
      // request auth
      {
        element: <ProtectRoute />,
        children: [
          {
            element: <EmployeeLayout />,
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "product",
                element: <Product />,
              },
              {
                path: "order",
                element: <Order />,
              },
            ],
          },
        ],
      },
      // without auth
      {
        path: "login",
        element: <EmpLogin />,
      },
      {
        path: "register",
        element: <EmpLogin />,
      },
      {
        path: "store",
        element: <Store />,
        //loader: categoryAll,
        children: [
          {
            // path: ":cateId",
            // element: <Menu />,
            //loader: menuInCategory,
            // children: [
            //   {
            //     path: ":menu",
            //     element: <MenuPopup />,
            //      loader: menuOtion,
            //   }
            // ]
          },
          
        ],
      },
    ],
  },
]);

//let theme = createTheme({});

export default function RoutesPages() {
  return <RouterProvider router={router} />;
}

// const isSmUp = useMediaQuery("(max-width: 640px)");
// const isMdUp = useMediaQuery("(max-width: 768px)");
// const isLgUp = useMediaQuery("(max-width: 1024px)");
// const isxlUp = useMediaQuery("(max-width: 1280px)");
