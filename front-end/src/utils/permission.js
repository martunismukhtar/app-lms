const SESSION_KEY = "session_user";

function can(permission) {
  const user = JSON.parse(sessionStorage.getItem("session_user"));  
  return user !== null && user.permissions.includes(permission);
}

function isAdmin(){
  const user = JSON.parse(sessionStorage.getItem("session_user"));  
  return user !== null && user.roles.includes('Administrator');
  // || user.roles.includes('Administrator'))
}

function getItem(item) {
  const user = JSON.parse(sessionStorage.getItem("session_user"));
  return user !== null && user[item];
}
function getTokens() {
  const user = JSON.parse(sessionStorage.getItem("session_user"));
  return {
    access: user !== null && user["access"],
    refresh: user !== null && user["refresh"],
  };
}

function saveSessions(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function updateSessionItem(item, value) {
  const user = JSON.parse(sessionStorage.getItem("session_user"));
  user[item] = value;
  sessionStorage.setItem("session_user", JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem("session_user");
}

export {
  can,
  getItem,
  getTokens,
  updateSessionItem,
  clearSession,
  saveSessions,
  isAdmin,
};
