import React from 'react';

const TextInput = ({ id, placeholder, value, onChange }) => (
  <input
    className='outline-none px-4 py-2 shadow-md rounded-md text-black'
    type="text"
    id={id}
    placeholder={placeholder}
    required
    value={value}
    onChange={onChange}
  />
);

export default TextInput;