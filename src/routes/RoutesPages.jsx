import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "../pages/Home";
import Error from "../pages/Error";
import EmployeeLayout from "../pages/employee/EmployeeLayout";
import Report from "../pages/employee/Report";
import Product from "../pages/employee/Product";

import EmpLogin from "../pages/employee/EmpLogin";

///

import ProtectRoute from "./ProtectRoute";

/////
import Store from "../pages/customer/Store";
import MenuProduct from "../pages/employee/MenuProduct";
import MenuCategory from "../pages/employee/MenuCategory";
import MenuMaterial from "../pages/employee/MenuMaterial";
import MenuAddOn from "../pages/employee/MenuAddOn";
import StoreSetting from "../pages/employee/StoreSetting";
import Record from "../pages/employee/Record";
import Order from "../pages/employee/Order";

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
                path: "report",
                element: <Report />,
              },
              {
                path: "product",
                element: <Product />,
                children: [
                  {
                    path: "menuProduct",
                    element: <MenuProduct />,
                  },
                  {
                    path: "menuMaterial",
                    element: <MenuMaterial />,
                  },
                  {
                    path: "menuCategory",
                    element: <MenuCategory />,
                  },
                  {
                    path: "menuAddOn",
                    element: <MenuAddOn />,
                  },
                ],
              },
              {
                path: "order",
                element: <Order />,
              },

              // {
              //   path: "orderEdit",
              //   element: <OrderEdit />,
              // },
              {
                path: "record",
                element: <Record />,
              },
              {
                path: "storeSetting",
                element: <StoreSetting />,
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
        path: "store",
        element: <Store />,
      },
    ],
  },
]);

export default function RoutesPages() {
  return <RouterProvider router={router} />;
}

// const isSmUp = useMediaQuery("(max-width: 640px)");
// const isMdUp = useMediaQuery("(max-width: 768px)");
// const isLgUp = useMediaQuery("(max-width: 1024px)");
// const isxlUp = useMediaQuery("(max-width: 1280px)");
