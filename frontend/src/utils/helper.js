export const validEmail = (email) => {
  const trimmedEmail = email.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(trimmedEmail);
};

export const getInitails = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let intials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    intials += words[i][0];
  }
  return intials.toUpperCase();
};

// export const gotEmptyCardImage = (filterType) => {
//   switch (filterType) {
//     case "search":
//       return "search";
//   }
// };

export const gotEmptyCardMessage = (filterType) => {
  console.log("message: ", filterType);
  switch (filterType) {
    case "search":
      return "Oops! No stories found matching your search.";

    case "date":
      return "No stories found in the given date range.";

    default:
      return "Start creating your first Travel Story! Click the 'Add' button to jot down your thoughts,ideas and memories. Let's get started!";
  }
};
