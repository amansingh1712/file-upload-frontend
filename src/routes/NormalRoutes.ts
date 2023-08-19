import { RouteInterface } from '../interface/RouteInterface';
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
import PageNotFound from '../pages/user/404/PageNotFound';
import Home from '../pages/user/home/Home';

const AppRoutesData: RouteInterface[] = [
  {
    path: '/',
    component: Home,
    name: 'Home',
  },
  {
    path: '/login',
    component: Login,
    name: 'Login',
  },
  {
    path: '/register',
    component: Register,
    name: 'Register',
  },
  {
    path: '*',
    component: PageNotFound,
    name: 'PageNotFound',
  },
];

export default AppRoutesData;
