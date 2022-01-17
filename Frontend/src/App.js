import React, { Suspense, lazy } from 'react';
import './App.css';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Switch, Route } from 'react-router-dom'
const Login = lazy(() => import('./Components/Login'))
const Registration = lazy(() => import('./Components/Registration'))
const Home = lazy(() => import('./Components/Home'))
const Products = lazy(() => import('./Components/Products'))
const ProductDetails = lazy(() => import('./Components/ProductDetails'))
const ForgotPassword = lazy(() => import('./Components/ForgotPassword'))
const MyProfile = lazy(() => import('./Components/MyProfile'))
const Cart = lazy(() => import('./Components/Cart'))
const Thankyou = lazy(() => import('./Components/Thankyou'))
const Checkout = lazy(() => import('./Components/Checkout'))
const Invoice = lazy(() => import('./Components/Invoice'))


toast.configure()
function App() {
  return (
    <div >
      <Suspense fallback={<div className="container text-center" style={{
        marginTop: "200px"
      }}
      ><img src="Images/loading.gif" /></div>}>
        <Switch>
          <Route path="/register" exact component={Registration} />
          <Route path="/login" exact component={Login} />
          <Route path="/" exact component={Home} />
          <Route path="/products" exact component={Products} />
          <Route path="/ProductDetails" exact component={ProductDetails} />
          <Route path="/forgotPassword" exact component={ForgotPassword} />
          <Route path="/MyProfile" exact component={MyProfile} />
          <Route path="/Cart" exact component={Cart} />
          <Route path="/thankyou" exact component={Thankyou} />
          <Route path="/checkout" exact component={Checkout} />
          <Route path="/invoice" exact component={Invoice} />
        </Switch>
      </Suspense>

    </div>
  );
}

export default App;
