import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Components/Header';
import AddItems from './Pages/AddItems';
import ItemQuantity from './Pages/ItemQuantity';
import Offers from './Pages/Offers';
import CurrentOrders from './Pages/CurrentOrders';
import OrderHistory from './Pages/OrderHistory';
import firebase from './Services/Firebase'
import Signin from './Sign-in'


const App = () => {
  const [user, setUser] = useState();
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState('');
  const [pageloader,setPageloader]=useState(true);
  const handleLogin = (email, password) => {
    setLoader(true)
    setError('')
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then((val) => {
          setLoader(false)
          setUser(val.user.uid)
        }, (err) => {
          setLoader(false)
          setError(err.message)
        })
      })
  }
  const handleSignOut = async (e) => {
    e.preventDefault();
    setPageloader(true);
    await firebase.auth().signOut().then(() => {
      setUser()
      console.log('User Signed out')
    });
    setPageloader(false);
  }

  useEffect(() => {
    const userCheck = async () => {
     firebase.auth().onAuthStateChanged(function (usr) {
        if (usr) {
          setUser(usr);
          setPageloader(false);
        } else {
          setUser();
          setPageloader(false);
        }
      })
    };
    userCheck();
  }, [])

  return (
   <div>{(!pageloader)?<div>
      {(user) ? <div><div className="ui inverted container" style={{ marginTop: '10px' }}>
        <Router>
          <Header />
          <Switch>
            <Route path="/" exact>
              <CurrentOrders />
            </Route>
            <Route path="/orderHistory" exact>
              <OrderHistory />
            </Route>
            <Route path="/offers">
              <Offers />
            </Route>
            <Route path="/qty">
              <ItemQuantity />
            </Route>
            <Route path="/additems">
              <AddItems />
            </Route>
          </Switch>
        </Router>
      </div>
        <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
          <button className="ui secondary large button" onClick={handleSignOut}>Sign-Out</button>
        </div></div> : <div ><Signin cred={(email, password) => {
          handleLogin(email, password)
        }} />
          {loader ? (
            <div className="ui large active loader" style={{marginTop:'50px',color:'white'}}></div>
          ) : (
              null
            )}
          {error ? (
            <center>
            <div className="ui inverted segment" style={{marginTop:"20px",marginLeft:"400px",marginRight:"400px"}}>
              <h1 style={{color:'white'}}>Error: {error}</h1>
            </div>
            </center>
          ) : (
              null
            )}
        </div>}
    </div>:<div class="ui active inverted massive loader" style={{paddingTop:"90px",paddingRight:"90px"}}>Loading......</div>}</div>
  );
};

export default App;
