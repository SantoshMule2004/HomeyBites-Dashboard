export const isLoggedIn = () => {
    let data = localStorage.getItem("authToken");
    if(data != null) return true;
    else return false;
};

export const doLogin = (data,next) => {
    localStorage.setItem("authToken", data.token);
    const userData = JSON.stringify(data.user);
    localStorage.setItem("user", userData);
    next()
};

export const doLogout = (next) => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("planId");
    localStorage.removeItem("subId");
    localStorage.removeItem("tiffinData");
    localStorage.removeItem("menuData");
    localStorage.removeItem("providerId");
    next()
}

export const getAuthToken = () => {
    return localStorage.getItem("authToken");
}

export const getUserInfo = () => {
    if(isLoggedIn())
        return JSON.parse(localStorage.getItem("user"));
}

export const setUserInfo = (user) => {
    const userData = JSON.stringify(user);
    localStorage.setItem("user", userData);
}