import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  //steps - algorithm
  // get users detail from frontend
  // validation - not empty
  // check if user already exists : from username or email or both
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in database in mongodb
  // remove password and refresh token field from response
  // check for user creation
  // return response if not send error
  const { fullName, email, username, password } = req.body;

  console.log(`User registration request received for ${username}`);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(400, "User already exists with this email or username");
  }

  req.files?.avatar?.[0];
  req.files?.coverImage?.[0];
});

export { registerUser };
