"use client"
import { SidebarDemo } from "@/components/sidebar";
import { ThemeProvider } from "@/context/themeProvider";
import { persistor, store } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout({children,}:Readonly<{children:React.ReactNode}>) {  


  return (  
    <Provider store={store}>  
    <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider>
    <SidebarDemo>
      {children}
    </SidebarDemo>
    </ThemeProvider>
    </PersistGate>
    </Provider>
  )
}



