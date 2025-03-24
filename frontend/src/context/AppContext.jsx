import { createContext,useEffect, useState } from "react";
import axios from 'axios'
import {toats} from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
}