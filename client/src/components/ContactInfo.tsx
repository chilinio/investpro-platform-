import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <FaMapMarkerAlt className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-gray-700">Address</h3>
            <p className="text-gray-600">No 5 Abideen Close, Lekki, Lagos</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <FaPhone className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-gray-700">Phone</h3>
            <p className="text-gray-600">+234 703 538 7205</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <FaEnvelope className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">amechiaminu@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo; 