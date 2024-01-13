const setToken = () => {
  let token : string | null = null;

  const signedUser: string | null = window.localStorage.getItem('Manufacturing_logedUser');
  const user = signedUser ? JSON.parse(signedUser) : null;
  if (user) {
    token = `Bearer ${user.data.token}`;
  }
  return token;
};
export default setToken;






