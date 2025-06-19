import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">InvestPro</h2>
            <p className="text-gray-400">
              Your trusted partner in investment growth and financial success.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-blue-500 mt-1" />
                <span className="text-gray-300">No 5 Abideen Close, Lekki, Lagos</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-500" />
                <span className="text-gray-300">+234 703 538 7205</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-500" />
                <span className="text-gray-300">amechiaminu@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/packages" className="text-gray-300 hover:text-white transition-colors">
                  Investment Packages
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} InvestPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 