import React, { useState } from '../../node_modules/react';
import Search from '../Components/Search';
import firebase from '../Services/Firebase';

const ItemQuantity = () => {
  const [item, setItem] = useState({});
  const [id, setId] = useState('');
  const [loader, setLoader] = useState(false);
  const [qty, setQty] = useState(0);

  const searchedName = async (query) => {
    setLoader(true);
    await firebase.firestore()
      .collection('items')
      .where('name', '==', query)
      .get()
      .then((doc) => {
        setId(doc.docs[0].id);
        setItem(doc.docs[0].data());
      })
      .then(() => {
        setLoader(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (qty !== 0) {
      setLoader(true);
      await firebase.firestore()
        .collection('items')
        .doc(id)
        .set(
          {
            itemQty: qty,
          },
          { merge: true }
        )
        .then(() => {
          setQty(0);
          setItem({});
          setId('');
          setLoader(false);
        });
    }
  };
  return (
    <div className="ui inverted segment" style={{padding:'50px',height:"750px"}}>
      <h1>Change Qty</h1>
      <div>
        <Search itemName={(query) => searchedName(query)} />
      </div>
      {item['name'] !== undefined ? (
        <div>
          <h1>Name:{item['name']}</h1>
          <h1>Price:{item['price']} Rs</h1>
          <h1>
            Current Qty:
            {item['itemQty'] !== undefined ? item['itemQty'] : 'None'}
          </h1>
          <label style={{ fontSize: '20px' }}>Qty:</label>
          <div className="ui small input focus">
            <input
              type="text"
              placeholder="Change Qty"
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>
          <button
            className="ui small button"
            style={{ margin: '10px' }}
            onClick={handleClick}
          >
            Submit
          </button>
        </div>
      ) : null}
      {loader === true ? (
        <div className="ui large active loader"></div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ItemQuantity;
