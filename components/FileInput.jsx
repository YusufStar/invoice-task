import React from 'react';

const FileInput = ({ onChange }) => (
  <input
    className="m-auto"
    type="file"
    accept="image/*"
    multiple={false}
    onChange={onChange}
  />
);

export default FileInput;
