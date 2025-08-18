// utils/parseApiErrors.js
// import { capitalizeFirstLetter } from "./libs";

export const parseApiErrors = (errorResponse) => {
  if (!errorResponse || typeof errorResponse !== "object") return [];

  const parsed = {};

  // const messages = [];

  for (const [field, msgs] of Object.entries(errorResponse)) {
    if (Array.isArray(msgs)) {
      msgs.forEach((msg) => {
        parsed[field] = msg;
        // messages.push(
        //   capitalizeFirstLetter(msg.replace("This field", field).replace("Bidang ini", field))
        // );
      });
    } else {
      parsed[field] = msgs;
      // messages.push(capitalizeFirstLetter(msgs));
    }
  }

  return parsed;
};
