// src/components/PublicRoute.jsx
import { useEffect } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";

function PublicRoute({ component: Component, path }: { component: React.FunctionComponent; path: string }) {
  const { isAuth } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (isAuth && location === "/login") {
      navigate("/home"); // si ya está logueado, lo manda al home
    }
  }, [isAuth, location, navigate]);

  return <Route path={path} component={Component} />;
}

export default PublicRoute;
