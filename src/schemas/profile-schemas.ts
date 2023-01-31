import Joi from "joi";
import { isValidCPF, isValidMobilePhone } from "@brazilian-utils/brazilian-utils";
import { PersonalInformationParams } from "@/services";

const cpfValidationSchema = Joi.string().length(11).custom(joiCpfValidation).required();
const mobilePhoneValidationSchema = Joi.string().min(14).max(15).custom(joiMobilePhoneValidation).required();
// const bloodValidationSchema = Joi.string().min(14).max(15).custom(joiBloodValidation).required();
// const sexValidationSchema = Joi.string().min(14).max(15).custom(joiSexValidation).required();

export const createProfileSchema = Joi.object<PersonalInformationParams>({
  name: Joi.string().min(3).required(),
  cpf: cpfValidationSchema,
  birthday: Joi.string().isoDate().required(),
  phone: mobilePhoneValidationSchema,
  blood: Joi.string().required(),
  sex: Joi.string().required(),
});

function joiCpfValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidCPF(value)) {
    return helpers.error("any.invalid");
  }

  return value;
}
function joiMobilePhoneValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  if (!isValidMobilePhone(value)) {
    return helpers.error("any.invalid");
  }

  return value;
}

// function joiBloodValidation(value: string, helpers: Joi.CustomHelpers<string>) {
//   if (!value) return value;

//   if (value !== "A" || value !== "B" || value !== "AB" || value !== "O") {
//     return helpers.error("any.invalid");
//   }

//   return value;
// }

// function joiSexValidation(value: string, helpers: Joi.CustomHelpers<string>) {
//   if (!value) return value;

//   if (value !== "Feminino" || value !== "Masculino") {
//     return helpers.error("any.invalid");
//   }

//   return value;
// }
