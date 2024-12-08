import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

function PatientSearch({ onSearch }) {
  return (
    <div className="mb-6">
      <div className="relative max-w-xl">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search patient by name or ID..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

PatientSearch.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default PatientSearch;