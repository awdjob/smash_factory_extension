import React from "react";

const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gray-400 p-8 rounded-lg shadow-lg z-10 w-4/5 h-4/5 relative flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black text-xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
