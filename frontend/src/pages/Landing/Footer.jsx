import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="h-[15rem] w-full bg-gradient-to-r from-blue-600 via-blue-900 to-neutral-950 text-white">
      <div className="container h-full flex flex-col justify-between p-8 text-lg">
        {/* Footer Top */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="left mb-4 sm:mb-0">
            <div className="text-2xl font-bold">Paper Writer</div>
            <div>© 2024, Paperwriter.io All rights reserved</div>
          </div>
          {/* Social Media Icons */}
          <div className="right flex space-x-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF
                size={24}
                className="hover:text-gray-300 transition-colors duration-200"
              />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter
                size={24}
                className="hover:text-gray-300 transition-colors duration-200"
              />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn
                size={24}
                className="hover:text-gray-300 transition-colors duration-200"
              />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                size={24}
                className="hover:text-gray-300 transition-colors duration-200"
              />
            </a>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="flex justify-center sm:justify-start">
          <div className="text-sm mt-4">
            For help, contact:{" "}
            <a
              href="mailto:support@cachelabs.io"
              className="underline hover:text-gray-300"
            >
              support@cachelabs.io
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
