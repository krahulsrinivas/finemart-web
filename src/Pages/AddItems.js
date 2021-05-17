import React, { useRef, useState } from '../../node_modules/react';
import firebase from '../Services/Firebase';
import axios from 'axios'

const AddItems = () => {
  const [loader, setLoader] = useState(false);
  const [item, setItem] = useState({
    name: '',
    price: '',
    image: '',
    itemType: '0',
    weights: {},
  });
  const [file, setFile] = useState('');
  const [count, setCount] = useState(0);
  const [weightType, setWeightType] = useState('none');
  const imageInput = useRef();
  const handleSubmit = async (event) => {
    event.preventDefault();
    var weights = {}
    if (Object.keys(item['weights']).length !== count) {
      const tempWeight = Object.keys(item['weights']).map((weight) => weight).slice(0, count)
      for (var i of tempWeight) {
        weights[i] = item['weights'][i]
      }
    } else {
      weights = item['weights']
    }
    var key = '';
    var value = '';
    if (weightType === 'none') {
      key = 'price';
      value = Number(item['price'])
    } else {
      key = 'weights';
      value = weights
    }
    console.log(weights);
    if (
      item['name'].trim() === '' ||
      (item['price'] === '' && weightType === 'none') ||
      item['image'].trim() === '' ||
      item['itemType'] === '0' ||
      (count === 0 && weightType === 'multiple weights')
    ) {
      alert('Please Enter/Select All Fields');
    } else {
      setLoader(true);
      var imageUrl = await firebase.storage()
        .ref(file.name)
        .put(file)
        .then(async (snapshot) => {
          return await snapshot.ref
            .getDownloadURL()
            .then(async (downloadUrl) => {
              return downloadUrl;
            });
        });
      var itemid = await firebase.firestore()
        .collection('items').orderBy('id', 'desc').limit(1)
        .get()
        .then((val) => {
          return Number(val?.docs?.[0]?.id ?? 0) + 1
        });
      await firebase.firestore()
        .collection('items')
        .doc(itemid.toString())
        .set({
          'name': item['name'][0].toUpperCase() + item['name'].slice(1),
          'image': imageUrl,
          'type': Number(item['itemType']),
          [key]: value,
          'search_key': item['name'][0].toUpperCase(),
          'id': itemid.toString(),
        })
        .then(async () => {
          await axios.post(' https://fine-mart.herokuapp.com/create',{"id":itemid.toString(),"name":item["name"]}).then(()=> {
            console.log("HI")
          }).catch(e=>console.log(e));
        }).catch((e) => console.log(e));
      imageInput.current.value = '';
      setFile('')
      setItem({
        name: '',
        price: '',
        image: '',
        itemType: '0',
        weights: {},
      });
      setFile('');
      setCount(0);
      setLoader(false);
    
  }
};

const handleImage = (e) => {
  const reader = new FileReader();
  setFile(e.target.files[0]);
  reader.onload = () => {
    if (reader.readyState === 2) {
      setItem({ ...item, image: reader.result });
    }
  };
  reader.readAsDataURL(e.target.files[0]);
};

const handleItemChange = (e, index, type) => {
  const val = e.target.value;
  setItem((prevItems) => {
    return {
      ...prevItems,
      weights: {
        ...prevItems.weights,
        [`weight_${index + 1}`]: {
          'weight': type === "weight" ? Number(val) : (prevItems['weights'][`weight_${index + 1}`]?.weight ?? 0),
          'type': type === "type" ? val : (prevItems['weights'][`weight_${index + 1}`]?.type ?? ''),
          'price': type === "price" ? Number(val) : (prevItems['weights'][`weight_${index + 1}`]?.price ?? 0)
        }
      }
    }
  })
}
return (
  <div className="ui inverted segment" style={{padding:'50px',height:"750px"}}>
    <h1>Add Items</h1>
    <form className="ui form" onSubmit={(event) => event.preventDefault()}>
      <div>
        <div className="ui medium input focus" style={{ margin: '10px' }}>
          <input
            type="text"
            placeholder="Item Name"
            value={item['name']}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
          />
        </div>
      </div>
      <div>
        <div className="ui small input focus" style={{ margin: '10px' }}>
          <input
            type="file"
            accept=".jpg"
            ref={imageInput}
            onChange={handleImage}
          />
        </div>
      </div>
      <div>
        <label style={{ margin: '10px', fontSize: '20px' }}>Weight Type :</label>
        <div className="ui small buttons" style={{ margin: '10px' }}>
          {(weightType === 'none') ? <button className="ui button active">None</button> : <button className="ui button" onClick={() => { setWeightType('none'); setCount(0) }}>None</button>}
          <div className="or"></div>
          {(weightType === 'multiple weights') ? <button className="ui button active">Multiple Weights</button> : <button className="ui button" onClick={() => { setWeightType('multiple weights'); setItem({ ...item, price: '' }) }}>Multiple Weights</button>}
        </div>
      </div>
      {(weightType === 'none') ? <div>
        <div className="ui medium input focus" style={{ margin: '10px' }}>
          <input
            type="text"
            placeholder="Item price"
            value={item['price']}
            onChange={(e) => setItem({ ...item, price: e.target.value })}
          />
        </div>
      </div> : null}
      {(weightType === 'multiple weights') ? <div>
        <label style={{ margin: '10px' }}>Number of Weights</label>
        <button
          className="ui button"
          style={{ margin: '10px' }}
          onClick={() => (count > 0 ? setCount(count - 1) : null)}
        >
          <i className="minus icon"></i>
        </button>
        {count}
        <button
          className="ui button"
          style={{ margin: '10px' }}
          onClick={() => setCount(count + 1)}
        >
          <i className="plus icon"></i>
        </button>
      </div> : null}
      {(weightType === 'multiple weights') ? Array(count)
        .fill()
        .map((val, index) => (
          <div style={{ margin: '20px' }}>
            <label>Input Weight {index + 1}:</label>
            <div className="ui small input focus" style={{ margin: '10px' }}>
              <input
                type="text"
                placeholder="Weight"
                onChange={(e) => handleItemChange(e, index, "weight")}
              />
            </div>
            <div className="ui small input focus" style={{ margin: '10px' }}>
              <input
                type="text"
                placeholder="Price For Weight"
                onChange={(e) => handleItemChange(e, index, "price")}
              />
            </div>
            <div
              className="ui small input focus"
              onChange={(e) => handleItemChange(e, index, "type")}
            >
              <select className="ui fluid dropdown">
                <option value="0">Weight Type</option>
                <option value="g">g</option>
                <option value="kg">Kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
              </select>
            </div>
          </div>
        )) : null}
      <div>
        <div className="ui medium input focus" style={{ margin: '10px' }}>
          <select
            className="ui fluid dropdown"
            value={item['itemType']}
            onChange={(e) => setItem({ ...item, itemType: e.target.value })}
          >
            <option value="0">Item Type</option>
            <option value="1">Bakery Products</option>
            <option value="2">Branded Foods</option>
            <option value="3">Dairy products</option>
            <option value="4">Fruits</option>
            <option value="5">Non-Veg Products</option>
            <option value="6">Snacks</option>
            <option value="7">Vegetables</option>
          </select>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="ui submit button"
          style={{ margin: '10px' }}
          onClick={handleSubmit}
        >
          Submit
          </button>
      </div>
    </form>

    {loader === true ? (
      <div className="ui large active loader"></div>
    ) : (
        <div></div>
      )}
    <div>
      {item['image'] !== '' ? (
        <img
          className="ui centered medium image"
          src={item['image']}
          style={{ position: 'absolute', top: '100px', left: '500px' }}
          alt=""
        ></img>
      ) : (
          <div></div>
        )}
    </div>
  </div>
);
};

export default AddItems;
