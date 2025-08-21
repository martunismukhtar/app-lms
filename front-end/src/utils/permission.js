const SESSION_KEY = "session_user";

function can(permission) {
  const user = JSON.parse(localStorage.getItem("session_user"));  
  return user !== null && user.permissions.includes(permission);
}

function isAdmin(){
  const user = JSON.parse(localStorage.getItem("session_user"));  
  return user !== null && user.roles.includes('Administrator');
}

function isManager(){
  const user = JSON.parse(localStorage.getItem("session_user"));  
  return user !== null && user.roles.includes('Manager');
}
function isTeacher(){
  const user = JSON.parse(localStorage.getItem("session_user"));  
  return user !== null && user.roles.includes('Teacher');
}

function isStudent(){
  const user = JSON.parse(localStorage.getItem("session_user"));  
  return user !== null && user.roles.includes('Student');
}

function getItem(item) {
  const user = JSON.parse(localStorage.getItem("session_user"));
  return user !== null && user[item];
}
function getTokens() {
  const user = JSON.parse(localStorage.getItem("session_user"));
  return {
    access: user !== null && user["access"],
    refresh: user !== null && user["refresh"],
  };
}

function saveSessions(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));  
}

function updateSessionItem(item, value) {
  const user = JSON.parse(localStorage.getItem("session_user"));
  user[item] = value;
  localStorage.setItem("session_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("session_user");
}

export {
  can,
  getItem,
  getTokens,
  updateSessionItem,
  clearSession,
  saveSessions,
  isAdmin,
  isManager,
  isTeacher,
  isStudent
};
