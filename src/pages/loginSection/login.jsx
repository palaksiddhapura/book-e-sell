import React from "react";
import { loginStyle } from "./style";
import {
  Breadcrumbs,
  Link,
  Typography,
  List,
  ListItem,
  Button,
  TextField,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import ValidationErrorMessage from "../../components/ValidationErrorMessage";
import authService from "../../service/auth.service";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/auth";

const Login = () => {
  const classes = loginStyle();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be 5 characters at minimum")
      .required("Password is required"),
  });

  const onSubmit = (values) => {
    authService.login(values).then((res) => {
      delete res._id;
      delete res.__v;
      authContext.setUser(res);
      navigate("/");
      toast.success("Successfully logged in");
    });
  };
  return (
    <div className={classes.loginWrapper}>
      <div className="login-page-wrapper">
        <div className="container">
        <h1 style={{ fontSize: "40px", textDecoration: "underline", fontFamily: "Times New Roman", textUnderlineOffset: "5px" }}>Login</h1> <br /> <br />
          <div className="login-row">
            <div className="form-block">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row-wrapper">
                      <div className="form-col">
                        <TextField
                          id="email"
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Email Address *"
                          autoComplete="off"
                          variant="outlined"
                          inputProps={{ className: "small", style: {
                            borderRadius: "10px"
                          } }}
                        />
                        <ValidationErrorMessage
                          message={errors.email}
                          touched={touched.email}
                        />
                      </div>
                      <div className="form-col">
                        <TextField
                          id="password"
                          name="password"
                          label="Password *"
                          type="password"
                          variant="outlined"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{ className: "small", style: {
                            borderRadius: "10px"
                          } }}
                          autoComplete="off"
                        />
                        <ValidationErrorMessage
                          message={errors.password}
                          touched={touched.password}
                        />
                      </div>
                      <div className="btn-wrapper">
                        <Button
                          type="submit"
                          className="blue-btn btn"
                          variant="contained"
                          color="primary"
                          disableElevation
                        >
                          Login
                        </Button>
                      </div> <br/>
                      <p>Don't have an Account?</p>
                      <div className="btn-wrapper">
                        <Button
                          className="blue-btn btn"
                          variant="contained"
                          color="primary"
                          disableElevation
                          onClick={() => {
                            navigate("/register");
                          }}
                        >
                          Create an Account
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
