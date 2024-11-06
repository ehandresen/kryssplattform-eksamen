// utils/dummyUserData.ts
import { UserData } from "./userData";

export const users: { [key: string]: Omit<UserData, "id"> } = {
  "1": {
    name: "John Doe",
    email: "johndoe@example.com",
    username: "@johndoe",
    profilePicture: "https://example.com/profile-pic1.jpg",
  },
  "2": {
    name: "Jane Smith",
    email: "janesmith@example.com",
    username: "@janesmith",
    profilePicture: "https://example.com/profile-pic2.jpg",
  },
  "3": {
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    username: "@alicejohnson",
    profilePicture: "https://example.com/profile-pic3.jpg",
  },
  "4": {
    name: "Michael Brown",
    email: "michaelbrown@example.com",
    username: "@michaelbrown",
    profilePicture: "https://example.com/profile-pic4.jpg",
  },
  "5": {
    name: "Sarah Lee",
    email: "sarahlee@example.com",
    username: "@sarahlee",
    profilePicture: "https://example.com/profile-pic5.jpg",
  },
};
