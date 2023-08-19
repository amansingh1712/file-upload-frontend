import { RouteInterface } from '../interface/RouteInterface';
import AppRoutesData from './NormalRoutes';
import { Route, Routes } from 'react-router-dom';

const AppRoutes: React.FunctionComponent = () => {
  return (
    <Routes>
      {AppRoutesData.map((route: RouteInterface, index: number) => {
        return (
          <Route
            key={index}
            path={`${route.path}`}
            element={<route.component />}
          ></Route>
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
