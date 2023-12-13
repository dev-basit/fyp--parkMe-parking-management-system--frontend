import Joi from "joi";
import { http } from "../httpService";
import { baseURL } from "../../constants/config";
import { showFailureToaster, showSuccessToaster } from "../../utils/toaster";
import { setLocalStorageItem } from "../../utils/localStorage";
import { auth } from "../authService";

const guardApiEndpoint = baseURL + "guards";

const guardSchema = Joi.object({
  companyId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  // assignedParkingId: Joi.string()
  //   .regex(/^[0-9a-fA-F]{24}$/)
  //   .required(),
  // assignedParking: Joi.string().required(),

  // this will be used to create User first, and then this userId will be assigned to employee automatically
  username: Joi.string().min(2).max(50).required(),
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().min(4).max(255).required(),
  password: Joi.string().min(4).max(255).required(),
  phone: Joi.string().min(4).max(128).required(),
  address: Joi.string().min(5).max(1024).required(),
  country: Joi.string().min(2).max(128).required(),
  city: Joi.string().min(2).max(128).required(),
  type: Joi.string().valid("employee", "company", "guard").required(),
});

const parkingAreaAsignSchema = Joi.object({
  guardId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  parkingAreaId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  assign: Joi.boolean().required(),
});

async function addGuard(user) {
  try {
    await http.post(guardApiEndpoint, { ...user });
    showSuccessToaster("Successfuly created new guard!");
    return true;
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

// // employeeId and companyId are acting as query strign params, it will be automatically applied if provided
// async function getGuard(guardId, parkingId) {
//   try {
//     let endpoint = guardApiEndpoint;
//     if (guardId || parkingId) endpoint += "?";
//     if (guardId) endpoint += "_id=" + guardId;
//     if (parkingId) endpoint += "companyId=" + parkingId;

//     return await http.get(endpoint);
//   } catch (err) {
//     showFailureToaster(err.data.errorMessage);
//     return false;
//   }
// }

async function getGuards(queryParams = "") {
  try {
    let endpoint = guardApiEndpoint;
    if (queryParams) endpoint += queryParams;

    return await http.get(endpoint);
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

async function assignParkingArea(data = {}) {
  try {
    await http.post(guardApiEndpoint + "/assign-parking-area", data);
    showSuccessToaster("Successfuly assigned parking area!");
  } catch (err) {
    showFailureToaster(err.data.errorMessage);
    return false;
  }
}

///////////////////

// async function getMyDetails() {
//   try {
//     http.setJwt(auth.getJwt());
//     return await http.get(employeeApiEndpoint + "/me");
//   } catch (err) {
//     showFailureToaster(err.data.errorMessage);
//     return false;
//   }
// }

// async function employeeDetails(id) {
//   try {
//     const response = await http.get(employeeApiEndpoint + "/details/" + id);
//     console.log("response in userdetails ", response);
//     return response;
//   } catch (err) {
//     showFailureToaster(err.data.errorMessage);
//     return false;
//   }
// }

// async function getAllArtists() {
//   try {
//     return await http.get(employeeApiEndpoint + "/artists");
//   } catch (err) {
//     showFailureToaster(err.data.errorMessage);
//     return false;
//   }
// }

export const guardService = {
  guardSchema,
  parkingAreaAsignSchema,
  addGuard,
  // getGuard,
  getGuards,
  assignParkingArea,
  // getMyDetails,
  // getAllArtists,
  // employeeDetails,
};
