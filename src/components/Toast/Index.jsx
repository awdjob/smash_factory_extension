import React from 'react';

const Toast = ({ message, onClose, klass }) => (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${klass} text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in flex items-center`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-auto text-white font-bold">×</button>
    </div>
)

export default Toast;