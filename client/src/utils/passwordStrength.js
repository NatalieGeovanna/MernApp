export const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

export const strengthConfig = [
  {
    text: "",
    color: "error",
    value: 0,
  },
  {
    text: "Muy débil",
    color: "error",
    value: 25,
  },
  {
    text: "Débil",
    color: "warning",
    value: 50,
  },
  {
    text: "Buena",
    color: "info",
    value: 75,
  },
  {
    text: "Muy segura",
    color: "success",
    value: 100,
  },
];

export const passwordRules = {
  minLength: (password) => password.length >= 8,
  uppercase: (password) => /[A-Z]/.test(password),
  number: (password) => /[0-9]/.test(password),
  special: (password) => /[^A-Za-z0-9]/.test(password),
};
