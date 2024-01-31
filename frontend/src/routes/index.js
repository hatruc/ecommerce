import AdminPage from "../pages/AdminPage/AdminPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import CartPage from "../pages/CartPage/CartPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderDetailsPage from "../pages/OrderDetailsPage/OrderDetailsPage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import ProfilePage from "../pages/Profile/ProfilePage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/profile",
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/product-details/:id",
    page: ProductDetailsPage,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
  },
  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
  },
  {
    path: "/my-order",
    page: MyOrderPage,
    isShowHeader: true,
  },
  {
    path: "/order-details/:id",
    page: OrderDetailsPage,
    isShowHeader: true,
  },
  {
    path: "/admin/*",
    page: AdminPage,
    errorPage: NotFoundPage,
    isShowHeader: false,
    isPrivate: true,
  },

  // {
  //   path: "/category/:id",
  //   page: OrderDetailsPage,
  //   isShowHeader: true,
  // },

  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
