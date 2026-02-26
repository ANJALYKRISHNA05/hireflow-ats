import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import AuthInitializer from "./components/AuthInitializer";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthInitializer>  <App /></AuthInitializer>
    
      <Toaster position="top-right" />
    </Provider>
  </React.StrictMode>
);
