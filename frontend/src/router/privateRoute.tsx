import React, { useEffect } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ component, path }: { component: React.FunctionComponent; path: string }) {
  const { isAuth, user } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Si no está autenticado, lo manda al login
    if ((!isAuth || !user) && location !== "/login") {
      navigate("/login");
    }
  }, [isAuth, user, location, navigate]);

  // Solo muestra el componente si está autenticado
  if (!isAuth || !user) {
    return null; // evita renderizar mientras redirige
  }

  return <Route path={path} component={component} />;
}

export default PrivateRoute;
