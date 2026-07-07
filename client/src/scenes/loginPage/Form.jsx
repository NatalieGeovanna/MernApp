import { useState, useRef } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import { AccountCircleOutlined } from "@mui/icons-material";
import { DescriptionOutlined } from "@mui/icons-material";
import { colombianCities } from "data/cities";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import {
  getPasswordStrength,
  strengthConfig,
  passwordRules,
} from "utils/passwordStrength";

const enableCV = process.env.REACT_APP_ENABLE_CV === "true";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("El nombre es obligatorio"),
  lastName: yup.string().required("El apellido es obligatorio"),
  email: yup
    .string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),

  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "Debe tener mínimo 8 caracteres")
    .matches(/[A-Z]/, "Debe contener una mayúscula")
    .matches(/[0-9]/, "Debe contener un número")
    .matches(/[^A-Za-z0-9]/, "Debe contener un carácter especial"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma la contraseña"),

  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.mixed().required("required"),
  document: enableCV
    ? yup.mixed().required("required")
    : yup.mixed().nullable(),
  rol: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
  document: null,
  rol: "",
  confirmPassword: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = ({ pageType, setPageType, activeStep, setActiveStep }) => {
  const formikRef = useRef(null);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const register = async (values, onSubmitProps) => {
    // esto permite enviar la informacion de la imagen y el documento
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      {
        method: "POST",
        body: formData,
      },
    );
    onSubmitProps.resetForm();

    if (savedUserResponse.ok) {
      setSnackbarSeverity("success");

      setSnackbarMessage("🎉 Cuenta creada correctamente");

      setSnackbarOpen(true);

      onSubmitProps.resetForm();

      setTimeout(() => {
        setSnackbarOpen(false);
        setPageType("login");
        setActiveStep(1);
      }, 3000);
    }
  };

  const login = async (values, onSubmitProps) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );

    const data = await response.json();

    onSubmitProps.resetForm();

    if (response.ok) {
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        }),
      );

      navigate("/home");

      return;
    }

    if (response.status === 403) {
      setEmailNotVerified(true);

      setSnackbarSeverity("warning");
      setSnackbarMessage(data.msg);
      setSnackbarOpen(true);
    } else {
      setEmailNotVerified(false);

      setSnackbarSeverity("error");
      setSnackbarMessage(data.msg);
      setSnackbarOpen(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  const handleResendVerification = async (email) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json();

    setSnackbarSeverity(response.ok ? "success" : "error");

    setSnackbarMessage(data.msg);

    setSnackbarOpen(true);
  };

  const nextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const wizardButtonStyle = {
    mt: 2,
    p: "1rem",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    backgroundColor: palette.primary.main,
    color: "#fff",
    boxShadow: "none",
    transition: "all .2s ease",

    "&:hover": {
      backgroundColor: palette.primary.dark,
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(25,118,210,.25)",
    },

    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 3px 10px rgba(25,118,210,.18)",
    },
  };

  const fillDemoAccount = () => {
    setPageType("login");

    setTimeout(() => {
      formikRef.current?.setValues({
        ...formikRef.current.values,
        email: "demo@mentify.com",
        password: "Mentify123!",
      });
    }, 0);
  };

  return (
    <Box>
      <Formik
        innerRef={formikRef}
        key={pageType}
        enableReinitialize
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
          validateForm,
          setTouched,
        }) => {
          const passwordStrength = getPasswordStrength(values.password);

          const currentStrength = strengthConfig[passwordStrength];
          console.log(values);

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Alert
              severity={snackbarSeverity}
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>;

          return (
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <Box mb={4}>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Crear cuenta
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Paso {activeStep} de 3
                  </Typography>

                  <Box
                    width="100%"
                    height="8px"
                    borderRadius="999px"
                    bgcolor={palette.neutral.light}
                  >
                    <Box
                      width={`${(activeStep / 3) * 100}%`}
                      height="100%"
                      borderRadius="999px"
                      bgcolor={palette.primary.main}
                      sx={{
                        transition: ".3s",
                      }}
                    />
                  </Box>
                </Box>
              )}
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                {isLogin && (
                  <>
                    <Box>
                      <Button
                        v
                        variant="contained"
                        fullWidth
                        startIcon={
                          <RocketLaunchOutlinedIcon sx={{ color: "#fff" }} />
                        }
                        onClick={fillDemoAccount}
                        sx={wizardButtonStyle}
                      >
                        Usa la Cuenta Demo
                      </Button>
                    </Box>

                    <TextField
                      label="Correo electrónico"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{ gridColumn: "span 4" }}
                    />

                    <TextField
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffOutlined />
                              ) : (
                                <VisibilityOutlined />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
                {isRegister && (
                  <>
                    {isRegister && activeStep === 1 && (
                      <>
                        <TextField
                          label="Nombres"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          name="firstName"
                          error={
                            Boolean(touched.firstName) &&
                            Boolean(errors.firstName)
                          }
                          helperText={touched.firstName && errors.firstName}
                          sx={{ gridColumn: "span 2" }}
                        />
                        <TextField
                          label="Apellidos"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          name="lastName"
                          error={
                            Boolean(touched.lastName) &&
                            Boolean(errors.lastName)
                          }
                          helperText={touched.lastName && errors.lastName}
                          sx={{ gridColumn: "span 2" }}
                        />

                        <TextField
                          label="Correo"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={
                            Boolean(touched.email) && Boolean(errors.email)
                          }
                          helperText={touched.email && errors.email}
                          sx={{ gridColumn: "span 4" }}
                        />

                        {/* CONTRASEÑA */}

                        <TextField
                          label="Contraseña"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.password && errors.password)}
                          helperText={touched.password && errors.password}
                          sx={{ gridColumn: "span 4" }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOffOutlined />
                                  ) : (
                                    <VisibilityOutlined />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        {/* CONFIRMAR CONTRASEÑA */}

                        <TextField
                          label="Confirmar contraseña"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                            touched.confirmPassword && errors.confirmPassword,
                          )}
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                          sx={{ gridColumn: "span 4" }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                  }
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOffOutlined />
                                  ) : (
                                    <VisibilityOutlined />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        {/* BARRA */}

                        <Box gridColumn="span 4">
                          <LinearProgress
                            variant="determinate"
                            value={currentStrength.value}
                            color={currentStrength.color}
                            sx={{
                              mt: 1,
                              height: 8,
                              borderRadius: 999,
                            }}
                          />

                          <Typography
                            mt={1}
                            fontWeight={600}
                            color={`${currentStrength.color}.main`}
                          >
                            {currentStrength.text}
                          </Typography>
                        </Box>

                        {/* REGLAS */}

                        <Box
                          gridColumn="span 4"
                          display="flex"
                          flexDirection="column"
                          gap={0.5}
                        >
                          <Typography
                            color={
                              passwordRules.minLength(values.password)
                                ? "success.main"
                                : "text.secondary"
                            }
                          >
                            {passwordRules.minLength(values.password)
                              ? "✓"
                              : "○"}{" "}
                            Mínimo 8 caracteres
                          </Typography>

                          <Typography
                            color={
                              passwordRules.uppercase(values.password)
                                ? "success.main"
                                : "text.secondary"
                            }
                          >
                            {passwordRules.uppercase(values.password)
                              ? "✓"
                              : "○"}{" "}
                            Una mayúscula
                          </Typography>

                          <Typography
                            color={
                              passwordRules.number(values.password)
                                ? "success.main"
                                : "text.secondary"
                            }
                          >
                            {passwordRules.number(values.password) ? "✓" : "○"}{" "}
                            Un número
                          </Typography>

                          <Typography
                            color={
                              passwordRules.special(values.password)
                                ? "success.main"
                                : "text.secondary"
                            }
                          >
                            {passwordRules.special(values.password) ? "✓" : "○"}{" "}
                            Un carácter especial
                          </Typography>
                        </Box>

                        {/* CONTRASEÑAS COINCIDEN */}

                        {values.confirmPassword && (
                          <Typography
                            gridColumn="span 4"
                            color={
                              values.password === values.confirmPassword
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {values.password === values.confirmPassword
                              ? "✓ Las contraseñas coinciden"
                              : "✗ Las contraseñas no coinciden"}
                          </Typography>
                        )}
                      </>
                    )}

                    {isRegister && activeStep === 2 && (
                      <>
                        <Box gridColumn="span 4">
                          <Typography fontWeight={600} mb={2}>
                            ¿Cómo quieres usar Mentify?
                          </Typography>

                          <Box
                            display="grid"
                            gridTemplateColumns="repeat(2,1fr)"
                            gap={2}
                          >
                            {/* Mentor */}

                            <Box
                              onClick={() => setFieldValue("rol", "Mentor")}
                              sx={{
                                border:
                                  values.rol === "Mentor"
                                    ? `2px solid ${palette.primary.main}`
                                    : "1px solid #ddd",

                                borderRadius: "18px",

                                p: 3,

                                cursor: "pointer",

                                transition: ".25s",

                                backgroundColor:
                                  values.rol === "Mentor"
                                    ? palette.primary.light + "20"
                                    : "#fff",

                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(25,118,210,.12)",
                                },
                              }}
                            >
                              <SchoolOutlinedIcon
                                sx={{
                                  fontSize: 42,
                                  color: palette.primary.main,
                                }}
                              />

                              <Typography mt={2} fontWeight={600}>
                                Mentor
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                              >
                                Comparte tu experiencia ayudando a otros
                                emprendedores.
                              </Typography>
                            </Box>

                            {/* Emprendedor */}

                            <Box
                              onClick={() =>
                                setFieldValue("rol", "Emprendedor")
                              }
                              sx={{
                                border:
                                  values.rol === "Emprendedor"
                                    ? `2px solid ${palette.primary.main}`
                                    : "1px solid #ddd",

                                borderRadius: "18px",

                                p: 3,

                                cursor: "pointer",

                                transition: ".25s",

                                backgroundColor:
                                  values.rol === "Emprendedor"
                                    ? palette.primary.light + "20"
                                    : "#fff",

                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(25,118,210,.12)",
                                },
                              }}
                            >
                              <RocketLaunchOutlinedIcon
                                sx={{
                                  fontSize: 42,
                                  color: palette.primary.main,
                                }}
                              />

                              <Typography mt={2} fontWeight={600}>
                                Emprendedor
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                              >
                                Encuentra mentores para impulsar tu proyecto.
                              </Typography>
                            </Box>
                          </Box>

                          {touched.rol && errors.rol && (
                            <Typography color="error" mt={1}>
                              {errors.rol}
                            </Typography>
                          )}
                        </Box>

                        <TextField
                          label="¿A qué te dedicas?"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.occupation}
                          name="occupation"
                          error={Boolean(
                            touched.occupation && errors.occupation,
                          )}
                          helperText={touched.occupation && errors.occupation}
                          sx={{ gridColumn: "span 4" }}
                        />

                        <TextField
                          select
                          label="Ciudad"
                          name="location"
                          value={values.location}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.location && errors.location)}
                          helperText={touched.location && errors.location}
                          sx={{ gridColumn: "span 4" }}
                        >
                          {colombianCities.map((city) => (
                            <MenuItem key={city} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </TextField>
                      </>
                    )}

                    {isRegister && activeStep === 3 && (
                      <Box
                        gridColumn="span 4"
                        display="flex"
                        flexDirection="column"
                        gap={3}
                      >
                        {/* HEADER */}
                        <Box textAlign="center">
                          <Typography variant="h5" fontWeight={700}>
                            Personaliza tu perfil
                          </Typography>

                          <Typography color="text.secondary" mt={1}>
                            Solo falta un paso para comenzar en Mentify.
                          </Typography>
                        </Box>

                        {/* FOTO */}
                        <Dropzone
                          acceptedFiles=".jpg,.jpeg,.png"
                          multiple={false}
                          onDrop={(acceptedFiles) =>
                            setFieldValue("picture", acceptedFiles[0])
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box
                              {...getRootProps()}
                              sx={{
                                border: `2px dashed ${palette.primary.main}`,
                                borderRadius: "22px",
                                p: 4,
                                cursor: "pointer",
                                textAlign: "center",
                                transition: ".25s",

                                "&:hover": {
                                  backgroundColor: palette.primary.light + "15",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              <input {...getInputProps()} />

                              <Typography
                                fontWeight={600}
                                color="primary"
                                mb={3}
                              >
                                Foto de perfil
                              </Typography>

                              {values.picture ? (
                                <>
                                  <Box
                                    component="img"
                                    src={URL.createObjectURL(values.picture)}
                                    sx={{
                                      width: 120,
                                      height: 120,
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                      mx: "auto",
                                      mb: 2,
                                      border: `4px solid ${palette.primary.light}`,
                                    }}
                                  />

                                  <Typography fontWeight={600}>
                                    {values.picture.name}
                                  </Typography>

                                  <Typography color="success.main" mt={1}>
                                    ✓ Imagen cargada
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="primary"
                                    mt={1}
                                  >
                                    Haz clic para cambiarla
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <AccountCircleOutlined
                                    sx={{
                                      fontSize: 90,
                                      color: palette.primary.main,
                                    }}
                                  />

                                  <Typography fontWeight={600} mt={2}>
                                    Haz clic para subir tu foto
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={1}
                                  >
                                    JPG o PNG • Máx. 5 MB
                                  </Typography>
                                </>
                              )}
                            </Box>
                          )}
                        </Dropzone>

                        {/* DOCUMENTO */}
                        {process.env.REACT_APP_ENABLE_CV === "true" && (
                          <Dropzone
                            acceptedFiles=".pdf,.doc,.docx"
                            multiple={false}
                            onDrop={(acceptedFiles) =>
                              setFieldValue("document", acceptedFiles[0])
                            }
                          >
                            {({ getRootProps, getInputProps }) => (
                              <Box
                                {...getRootProps()}
                                sx={{
                                  border: `2px dashed ${palette.primary.main}`,
                                  borderRadius: "22px",
                                  p: 4,
                                  cursor: "pointer",
                                  textAlign: "center",
                                  transition: ".25s",

                                  "&:hover": {
                                    backgroundColor:
                                      palette.primary.light + "15",
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                <input {...getInputProps()} />

                                <Typography
                                  fontWeight={600}
                                  color="primary"
                                  mb={3}
                                >
                                  {values.rol === "Mentor"
                                    ? "Hoja de vida"
                                    : "Presentación del emprendimiento"}
                                </Typography>

                                {values.document ? (
                                  <>
                                    <DescriptionOutlined
                                      sx={{
                                        fontSize: 70,
                                        color: palette.primary.main,
                                        mb: 2,
                                      }}
                                    />

                                    <Typography fontWeight={600}>
                                      {values.document.name}
                                    </Typography>

                                    <Typography color="success.main" mt={1}>
                                      ✓ Archivo cargado
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      mt={1}
                                    >
                                      Haz clic para reemplazarlo
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    <DescriptionOutlined
                                      sx={{
                                        fontSize: 70,
                                        color: palette.primary.main,
                                      }}
                                    />

                                    <Typography fontWeight={600} mt={2}>
                                      {values.rol === "Mentor"
                                        ? "Sube tu hoja de vida"
                                        : "Cuéntanos sobre tu emprendimiento"}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      mt={1}
                                    >
                                      {values.rol === "Mentor"
                                        ? "PDF • DOC • DOCX"
                                        : "PDF, DOC o DOCX"}
                                    </Typography>
                                  </>
                                )}
                              </Box>
                            )}
                          </Dropzone>
                        )}

                        <Typography
                          textAlign="center"
                          color="text.secondary"
                          fontSize="0.85rem"
                        >
                          Podrás cambiar esta información más adelante desde tu
                          perfil.
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>

              {/* BUTTONS */}
              <Box>
                <Box mt={4}>
                  {isRegister ? (
                    <Box display="flex" justifyContent="space-between" mt={5}>
                      {activeStep > 1 ? (
                        <Button
                          variant="outlined"
                          onClick={previousStep}
                          sx={wizardButtonStyle}
                        >
                          Atrás
                        </Button>
                      ) : (
                        <Box width="100px" />
                      )}
                      {activeStep < 3 ? (
                        <Button
                          variant="contained"
                          onClick={async () => {
                            const errors = await validateForm();

                            if (activeStep === 1) {
                              setTouched({
                                firstName: true,
                                lastName: true,
                                email: true,
                                password: true,
                                confirmPassword: true,
                              });

                              if (
                                !errors.firstName &&
                                !errors.lastName &&
                                !errors.email &&
                                !errors.password &&
                                !errors.confirmPassword
                              ) {
                                nextStep();
                              }
                            }

                            if (activeStep === 2) {
                              setTouched({
                                rol: true,
                                occupation: true,
                                location: true,
                              });

                              if (
                                !errors.rol &&
                                !errors.occupation &&
                                !errors.location
                              ) {
                                nextStep();
                              }
                            }
                            if (activeStep === 3) {
                              setTouched({
                                picture: true,
                                ...(enableCV && { document: true }),
                              });
                              if (
                                !errors.picture &&
                                (!enableCV || !errors.document)
                              ) {
                                handleSubmit();
                              }
                            }
                          }}
                          sx={wizardButtonStyle}
                        >
                          Siguiente
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          type="submit"
                          sx={wizardButtonStyle}
                        >
                          Crear cuenta
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Button fullWidth type="submit" sx={wizardButtonStyle}>
                      Iniciar sesión
                    </Button>
                  )}
                  {process.env.REACT_APP_EMAIL_VERIFICATION === "true" &&
                    emailNotVerified && (
                      <Alert
                        severity="warning"
                        sx={{
                          mt: 2,
                          borderRadius: 3,
                        }}
                      >
                        <Typography fontWeight={600}>
                          Tu cuenta aún no ha sido verificada.
                        </Typography>

                        {/* <Typography variant="body2" sx={{ mt: 1 }}>
                          Revisa tu bandeja de entrada y verifica tu correo.
                        </Typography> */}

                        <Button
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleResendVerification(values.email)}
                        >
                          Reenviar correo
                        </Button>
                      </Alert>
                    )}
                </Box>

                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    setActiveStep(1);
                    setEmailNotVerified(false); // opcional
                    setSnackbarOpen(false);
                    setSnackbarMessage("");
                  }}
                  sx={{
                    mt: 4,
                    textAlign: "center",
                    textDecoration: "none",
                    color: palette.primary.main,
                    fontWeight: 500,
                    "&:hover": {
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: palette.primary.dark,
                    },
                  }}
                >
                  {isLogin
                    ? "¿No tienes una cuenta? Regístrate"
                    : "¿Ya tienes una cuenta? Inicia sesión"}
                </Typography>
              </Box>
            </form>
          );
        }}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;
