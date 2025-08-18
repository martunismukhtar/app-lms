function saveTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

function deleteTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// function getTokens() {
//   return {
//     access: localStorage.getItem("access_token"),
//     refresh: localStorage.getItem("refresh_token"),
//   };
// }

function saveOrg(org) {
  localStorage.setItem("organization", org);
}

function getOrg() {
  return localStorage.getItem("organization");
}

function deleteOrg() {
  localStorage.removeItem("organization");
}

// function saveAttr(attr, value) {
//   localStorage.setItem(attr, value);
// }

function saveAttr(data) {
  for (const [key, value] of Object.entries(data)) {
    // Konversi ke string sebelum disimpan
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function getAttr(attr) {
  return localStorage.getItem(attr);
}

// const roles = JSON.parse(localStorage.getItem("roles"));
// const organization = JSON.parse(localStorage.getItem("organization"));

function deleteAttr(attr) {
  localStorage.removeItem(attr);
}

export { 
  saveTokens, 
  deleteTokens, 
  // getTokens, 
  saveOrg, 
  getOrg, 
  deleteOrg,
  saveAttr,
  getAttr,
  deleteAttr
};