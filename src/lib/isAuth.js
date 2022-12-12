const isAuth = () => {
  return localStorage.getItem("token");
};

export const userType = () => {
  return localStorage.getItem("type");
};

export const userName = () => {
  return localStorage.getItem("name");
};

export default isAuth;
