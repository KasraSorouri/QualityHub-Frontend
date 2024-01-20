const setToken = () => {
  let token : string | null = null;

  // Read User
  const signedUser: string | null = window.localStorage.getItem('QualityHub_SignedUser');
  const user = signedUser ? JSON.parse(signedUser) : null;

  // Create Token
  if (user) {
    token = `Bearer ${user.token}`;
  }

  return token;
};
export default setToken;






