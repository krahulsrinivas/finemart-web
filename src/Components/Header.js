import React from 'react';
import { Link,useLocation} from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  let currentOrders = (location.pathname === "/")?"ui active inverted item":"ui inverted item";
  let orderHistory = (location.pathname === "/orderHistory"|| location.pathname === "/yourDrafts")?"ui active inverted item":"ui inverted item";
  let offers = (location.pathname === "/offers")?"ui active inverted item":"ui inverted item";
  let qty = (location.pathname === "/qty")?"ui active inverted item":"ui inverted item";
  let additems = (location.pathname === "/additems")?"ui active inverted item":"ui inverted item";
  return (
    <div className="ui inverted five item menu">
      <Link to="/" className={currentOrders}>
        <h3> Current Orders</h3>
      </Link>
      <Link to="/orderHistory" className={orderHistory}>
        <h3>Order History</h3>
      </Link>
      <Link to="/offers" className={offers}>
        <h3>Add/Change Offers</h3>
      </Link>
      <Link to="/qty" className={qty}>
        <h3>Change Item Qty</h3>
      </Link>
      <Link to="/additems" className={additems}>
        <h3>Add Items</h3>
      </Link>
    </div>
  );
};

export default Header;
