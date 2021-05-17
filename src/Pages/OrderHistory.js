import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import firebase from '../Services/Firebase';

const CurrentOrders = () => {
  const [orders, setOrders] = useState({});
  useEffect(() => {
    firebase.firestore().collection('orders')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' ||change.type === 'modified' ) {
            snapshot.docChanges().map(async (order) => {
              const userInfo = await firebase.firestore()
                .collection('users')
                .doc(order.doc.data()['userId'])
                .get();
              const orderInfo = {
                [order.doc.id]: { ...order.doc.data(), ...userInfo.data() },
              };
              setOrders((prevOrders) => {
                return {
                  ...prevOrders,
                  ...orderInfo,
                };
              });
            });
          } else {
            setOrders((prevOrders) => {
              const order = { ...prevOrders };
              delete order[change.doc.id];
              return order;
            });
          }
        });
      }, (error) => {
        console.log(error);
      });
  }, []);
  
  return (
    <div className="ui inverted container">
      <h1 style={{color:"white"}}>Order History</h1>
      <table className="ui inverted celled padded table" >
      <colgroup>
          <col span="1" style={{ width: "20%" }} />
          <col span="1" style={{ width: "50%" }} />
          <col span="1" style={{ width: "30%" }} />
        </colgroup>
        <thead>
          <tr>
            <th className="ui center aligned header">Order Id</th>
            <th className="ui center aligned header">Order Data</th>
            <th className="ui center aligned header">User Info</th>
          </tr>
        </thead>
        <tbody>
          {!_.isEmpty(orders) &&
            Object.keys(orders).map((orderid) => (
                <tr key={orderid}>
                  <td>
                  <center>
                  <pre style={{fontSize:"20px"}}> {`${orders[orderid]['time'].toDate().toDateString()} \n\n ${orders[orderid]['time'].toDate().toLocaleTimeString('en-IN')}`}</pre>
                  </center>
                    <h2 className="ui inverted center aligned header" >
                      Oid: 00{orderid}
                    </h2>
                    <center>
                    <h2>Status: {orders[orderid]['status']}</h2> 
                    </center>
                  </td>
                  <td >
                    {Object.keys(orders[orderid]['items'])
                      .map((id) => (
                        <div class="ui list" style={{ fontSize: "25px", margin: "5px" }}>
                          {(orders[orderid]['items'][id]['weights'] !== undefined) ? Object.keys(orders[orderid]['items'][id]['weights']).map((value) => (
                            <div class="item" >
                              <div class="header" style={{ color: "white", margin: "5px" }}>{orders[orderid]['items'][id]['name']}</div>
                              <pre style={{ margin: "5px" }}>Weight: {orders[orderid]['items'][id]['weights'][value]['weight']}
                                {orders[orderid]['items'][id]['weights'][value]['type']} {''}
                           Count: {orders[orderid]['items'][id]['weights'][value]['count']}x {''}
                           Price: Rs {orders[orderid]['items'][id]['weights'][value]['count'] *
                                  orders[orderid]['items'][id]['weights'][value]['price']}</pre>
                            </div>
                          )) : (<div class="item">
                            <div class="header" style={{ color: "white", margin: "5px" }}>{orders[orderid]['items'][id]['name']}</div>
                            <pre style={{ margin: "5px" }}>Count: {orders[orderid]['items'][id]['count']}x {''}
                          Price: Rs {orders[orderid]['items'][id]['count'] *
                                orders[orderid]['items'][id]['price']}</pre>
                          </div>)}
                        </div>
                      ))}
                  </td>
                  <td>
                    <h3>Name: {orders[orderid]['full_name']}</h3>
                    <h3>Ph no: {orders[orderid]['phone_number']}</h3>
                    <h3>Address: {orders[orderid]['address']}, {orders[orderid]['outerAddress']}</h3>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentOrders;