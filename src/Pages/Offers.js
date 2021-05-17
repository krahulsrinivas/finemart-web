import React, { useState } from '../../node_modules/react';
import Search from '../Components/Search';
import firebase from '../Services/Firebase';

const Offers = () => {
  const [item, setItem] = useState({});
  const [id, setId] = useState('');
  const [loader, setLoader] = useState(false);
  const [offer, setOffer] = useState(0);
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState(false);
  const [text, setText] = useState({ 'name': '', 'message': '' });
  const searchedName = async (query) => {
    setLoader(true);
    await firebase.firestore()
      .collection('items')
      .where('name', '==', query)
      .get()
      .then((doc) => {
        setId(doc.docs[0].id);
        setItem(doc.docs[0].data());
        setOffer(0);
        setWeight('');
        setMessage(false);
        setText({ 'name': '', 'message': '' });
        setLoader(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (offer !== 0) {
      setLoader(true);
      if (weight === '') {
        await firebase.firestore()
          .collection('items')
          .doc(id)
          .set(
            {
              offerPrice: offer,
            },
            { merge: true }
          )
          .then(async () => {
            await firebase.firestore()
              .collection('offers')
              .doc(id)
              .set(
                {
                  'name': item['name'],
                  'price': item['price'],
                  'offerPrice': offer,
                  'image': item['image'],
                  'id':item['id'],
                },
                { merge: true }
              ).then(() => {
                setOffer(0);
                setItem({});
                setId('');
                setWeight('');
                setMessage(false);
                setText({ 'name': '', 'message': '' });
                setLoader(false);
              })
          });
      } else {
        await firebase.firestore()
          .collection('items')
          .doc(id)
          .set(
            {
              'weights': {
                [`${weight}`]: {
                  offerPrice: offer,
                }
              }
            },
            { merge: true }
          )
          .then(async () => {
            await firebase.firestore()
              .collection('offers')
              .doc(id)
              .set(
                {
                  'name': item['name'],
                  'price': item['weights'][weight]['price'],
                  'weight': `${item['weights'][weight]['weight']} ${item['weights'][weight]['type']}`,
                  'offerPrice': offer,
                  'image': item['image'],
                  'id':item['id']
                },
                { merge: true }
              ).then(() => {
                setOffer(0);
                setItem({});
                setId('');
                setWeight('');
                setMessage(false);
                setText({ 'name': '', 'message': '' });
                setLoader(false);
              })
          });
      }
    } else {
      alert('Please Enter an Offer')
    }
  };

  const handleMessage = async (e, value) => {
    if (value !== 'submit') {
      setText({ ...text, [value]: e.target.value })
    } else {
      setLoader(true);
      await firebase.firestore()
        .collection('offers')
        .doc()
        .set(
          {
            'name': text['name'],
            'message': text['message']
          },
          { merge: true }
        ).then(() => {
          setOffer(0);
          setItem({});
          setId('');
          setWeight('');
          setMessage(false);
          setText({ 'name': '', 'message': '' });
          setLoader(false);
        })
    }
  };

  return (
    <div className="ui inverted segment" style={{padding:'50px',height:"750px"}}>
      <h1>Add/Change Offers</h1>
      <div>
        <Search search={(query) => searchedName(query)} />
      </div>
      {item.hasOwnProperty('name') ? (
        <div key={item['id']}>
          <h1>Name: {item['name']}</h1>
          {(item.hasOwnProperty('price')) ?
            (
              <div>
                <h1>Price: {item['price']}Rs</h1>
                <h1>
                  Current Offer Price:
            {item.hasOwnProperty('offerPrice')
                    ? item['offerPrice'] + ' Rs'
                    : ' None'}
                </h1>
                <label style={{ fontSize: '20px' }}>Offer Price: </label>
                <div className="ui small input focus">
                  <input
                    type="text"
                    placeholder="Add Offer Price"
                    onChange={(e) => setOffer(Number(e.target.value))}
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
            ) : <div>
              {(weight === '') ? <h2>Select a weight</h2> : null}
              {Object.keys(item['weights']).map((value) => (
                <button
                  key={value}
                  className="ui small button"
                  style={{ margin: '10px' }}
                  onClick={() => setWeight(value)}
                >
                  {item['weights'][value]['weight']} {item['weights'][value]['type']}
                </button>
              ))}
              {(weight !== '') ? <div>
                <h1>Price:{item['weights'][weight]['price']}</h1>
                <h1>Weight:{item['weights'][weight]['weight']} {item['weights'][weight]['type']}</h1>
                <h1>
                  Current Offer Price:
            {item['weights'][weight].hasOwnProperty('offerPrice')
                    ? item['weights'][weight]['offerPrice'] + ' Rs'
                    : ' None'}
                </h1>
                <label style={{ fontSize: '20px' }}>Offer Price: </label>
                <div className="ui small input focus">
                  <input
                    type="text"
                    placeholder="Add Offer Price"
                    onChange={(e) => setOffer(Number(e.target.value))}
                  />
                </div>
                <button
                  className="ui small button"
                  style={{ margin: '10px' }}
                  onClick={handleClick}
                >
                  Submit
          </button>
              </div> : null
              }
            </div>
          }
        </div>
      ) : null}
      {loader === true ? (
        <div className="ui large active loader"></div>
      ) : (
          <div></div>
        )}
      {(!message) ? <div>
        <button
          className="ui big button"
          style={{ marginTop: '20px' }}
          onClick={() => {
            setMessage(true);
            setOffer(0);
            setItem({});
            setId('');
            setWeight('');
          }}
        >
          Enter Text Message
          </button>
      </div> : <div style={{ marginTop: '20px' }}>
          <div><h2>Enter Title and Message</h2></div>
          <div>
            <div className="ui small input focus" style={{ marginTop: '20px' }}>
              <input
                type="text"
                value={text['name']}
                placeholder="Add Title"
                onChange={(e) => handleMessage(e, 'name')}
              />
            </div>
          </div>
          <div>
            <div className="ui medium input focus" style={{ marginTop: '20px' }}>
              <textarea placeholder="Add Message" rows="6" cols="80" onChange={(e) => handleMessage(e, 'message')} value={text['message']}></textarea>
            </div>
            <div>
              <button
                className="ui medium button"
                style={{ marginTop: '20px' }}
                onClick={(e) => {
                  handleMessage(e, 'submit')
                }}
              >Submit</button>
            </div>
          </div>
        </div>}
    </div>
  );
};

export default Offers;
