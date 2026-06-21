"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { persistor, store } from "../Redux/store";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster position="top-right" richColors />
          {children}
        </PersistGate>
      </ReduxProvider>
    </div>
  );
};

export default Provider;
