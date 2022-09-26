import React from "react";

const defaultAuthContext = {
    isAdmin: false
}

export const AuthContext = React.createContext(defaultAuthContext)