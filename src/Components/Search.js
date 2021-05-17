import React, { useState } from 'react';

const Search = ({ ...props }) => {
  const { search } = props;
  const [query, setQuery] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      search(query.trim()[0].toUpperCase() + query.trim().slice(1));
    }
  };

  return (
    <div>
      <div className="ui big input focus">
        <input
          type="text"
          placeholder="Search for Item"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        className="ui button"
        style={{ margin: '10px' }}
        onClick={(e) => handleClick(e)}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
