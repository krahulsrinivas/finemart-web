import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import firebase from '../Services/Firebase';

const CurrentOrders = () => {
  const [orders, setOrders] = useState({});
  const ChangeStatus = async (uid, message) => {
    await firebase.firestore().collection('orders').doc(uid).set(
      {
        status: message,
      },
      { merge: true }
    );
  };
  const handleCopy = async (orderid) => {
    let value = `Orderid: 00${orderid}\nName: ${orders[orderid]['full_name']}, Ph no: ${orders[orderid]['phone_number']}\nAddress: ${orders[orderid]['address']}, ${orders[orderid]['outerAddress']}\n`
    Object.keys(orders[orderid]['items'])
      .map((id) => {
        if (orders[orderid]['items'][id]['weights'] !== undefined) {
          Object.keys(orders[orderid]['items'][id]['weights']).map((x) => {
            value = value.concat([`Item: ${orders[orderid]['items'][id]['name']}`, ` Weight: ${orders[orderid]['items'][id]['weights'][x]['weight']}${orders[orderid]['items'][id]['weights'][x]['type']}`, ` Count: ${orders[orderid]['items'][id]['weights'][x]['count']}x`, ` Price: Rs ${orders[orderid]['items'][id]['weights'][x]['count'] * orders[orderid]['items'][id]['weights'][x]['price']}\n`]);
          })
        } else {
          value = value.concat([`Item: ${orders[orderid]['items'][id]['name']}`, ` Count: ${orders[orderid]['items'][id]['count']}x`, ` Price: Rs ${orders[orderid]['items'][id]['count'] *
            orders[orderid]['items'][id]['price']}\n`]);
        }
        alerts("white", orderid, "Order Copied");
      });
    const el = document.createElement('textarea');
    el.value = value
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  useEffect(() => {
    firebase.firestore().collection('orders')
      .where('status', 'in', ['placed', 'accepted'])
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
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
      });
  }, []);



  const alerts = (type, id, message)=>{
    const el = document.createElement('div');
    el.className = `ui ${type} message transition visible`
    el.innerHTML = '<i class="close icon"></i>'
    el.innerHTML = el.innerHTML + `<div class="header">Orderid:00${id}</div>`
    el.innerHTML = el.innerHTML + `<p>${message}</p>`
    el.style.position = 'absolute';
    el.style.left = '5px';
    el.style.top = '20px'
    document.body.appendChild(el);
    setTimeout(() => {
      document.body.removeChild(el);
    }, 2000)
    
  };
  return (
    <div className="ui inverted container" >
      <h1 style={{ color: "white" }}>Current Orders</h1>
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
            Object.keys(orders)
              .map((orderid) => (
                <tr key={orderid} >
                  <td>
                  <center>
                 <pre style={{fontSize:"20px"}}> {`${orders[orderid]['time'].toDate().toDateString()} \n\n ${orders[orderid]['time'].toDate().toLocaleTimeString('en-IN')}`}</pre>
                  </center>
                    <h2 className="ui inverted center aligned header" >
                      Oid: 00{orderid}
                    </h2>
                    <center>
                      {(orders[orderid]['status'] === "placed") ? <div
                        className="ui animated green button"
                        tabIndex={0}
                        onClick={() => {
                          const value=window.confirm("Are u sure u want to accept this order");
                          if (value){
                          ChangeStatus(orderid, "accepted");
                          alerts("green", orderid, "Order Accepted");
                          }
                        }}
                        style={{ margin: "20px" }}
                      >
                        <div className="visible content">Accept Order</div>
                        <div className="hidden content">
                          <i className="shopping bag icon"></i>
                        </div>
                      </div> : <div></div>}
                    </center>
                    <center>
                      {(orders[orderid]['status'] === "accepted") ? <div
                        className="ui animated blue button"
                        tabIndex={0}
                        onClick={() => {
                          const value=window.confirm("Are u sure this order has been delivered");
                          if (value){
                          ChangeStatus(orderid, "delivered");
                          alerts("blue", orderid, "Order Delivered");
                        }
                      }}
                        style={{ margin: "20px" }}
                      >
                        <div className="visible content">Order Delivered</div>
                        <div className="hidden content">
                          <i className="check icon"></i>
                        </div>
                      </div> : <div></div>}
                    </center>
                    <center>
                      <div
                        className="ui animated red button"
                        tabIndex={0}
                        onClick={() => {
                          const value=window.confirm("Are u sure u want to cancel this order");
                          if (value){
                          ChangeStatus(orderid, "cancelled");
                          alerts("red", orderid, "Order cancelled");
                          }
                        }}
                      >
                        <div className="visible content">Cancel Order</div>
                        <div className="hidden content">
                          <i className="trash alternate icon"></i>
                        </div>
                      </div>
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
                    <h3>Name: testuser123</h3>
                    <h3>Ph no: 9674563212</h3>
                    <h3>Address: {orders[orderid]['address']}, {orders[orderid]['outerAddress']}</h3>
                    <button className="ui blue tiny button" onClick={(e) => {
                      handleCopy(orderid)
                    }}>Copy Info</button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentOrders;