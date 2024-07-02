/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";

const initialState = {
  name: localStorage.getItem('name') != undefined ? JSON.parse(localStorage.getItem('name')) : null ,
  email: localStorage.getItem('email') || null,
  token: localStorage.getItem('token') || null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        name: null,
        email: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        name: action.payload.name,
        token: action.payload.token,
        email: action.payload.email,
      };
    case "LOGOUT":
      return {
        name: null,
        email: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    
    useEffect(() => {
        localStorage.setItem('name', JSON.stringify(state.name))
        localStorage.setItem('token', state.token)
        localStorage.setItem('email' , state.email)
    } , [state])

  return (
    <authContext.Provider
      value={{
        name: state.name,
        token: state.token,
        email: state.email,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
