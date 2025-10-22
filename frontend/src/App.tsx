import { Link, Route, Switch } from 'wouter';

import LoginPage from './pages/login';
import HomePage from './pages/home';
import PrivateRoute from './router/privateRoute';
import PublicRoute from './router/publicRoute';

function App() {

  return (
    <Switch>
      <PrivateRoute path="/home" component={HomePage} />
      <PublicRoute path="/login" component={LoginPage} />
      <Route>
        <>
          <div>404 - Not Found</div>
          <Link href="/login">Go to Login</Link>
        </>
      </Route>
    </Switch>
  )
}

export default App
