import React from 'react';
import { createRoot } from 'react-dom/client';
import Config from './Config';
import './styles.css';

const container = document.getElementById('config-root');
const root = createRoot(container);
root.render(<Config />); 