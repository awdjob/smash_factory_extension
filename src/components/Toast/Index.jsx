const Toast = ({ message, onClose }) => (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-ssb-blue text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
        {message}
        <button onClick={onClose} className="ml-4 text-white font-bold">×</button>
    </div>
)

export default Toast;