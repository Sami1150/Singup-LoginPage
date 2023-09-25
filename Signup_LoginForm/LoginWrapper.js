import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const loginInputs = [
  {
    label: 'User Name',
    type: 'text',
    show: true,
    validated: '',
    id: 'a',
  },
  {
    label: 'Password',
    type: 'password',
    show: true,
    validated: '',
    id: 'b',
  },
];

const signupInputs = [
  {
    label: 'User Name',
    type: 'text',
    show: false,
    validated: '',
    id: 'c',
  },
  {
    label: 'Email',
    type: 'email',
    show: false,
    validated: '',
    id: 'd',
  },
  {
    label: 'Password',
    type: 'password',
    show: false,
    validated: '',
    id: 'e',
  },
  {
    label: 'Re-Enter Password',
    type: 'password',
    show: false,
    validated: '',
    id: 'f',
  },
];

const createUser = async (username, password, email, confirmPassword) => {
  // Create an object with the updated data
  const userData = {
    username: username,
    password: password,
    email: email,
    role: 'USER', // Set the role to "USER"
    loggedIn: false, // Set loggedIn to "false"
  };
  if (!username || !password || !email || !confirmPassword) {
    toast.error('Please fill in all fields.');
    return;
  }
  else if (password !== confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }
  else {
    //Login to check Null for all 3 fields

    // Send the POST request
    try {
      const response = await axios.post('/api/v1/users/signup', userData);
      console.log("Sending"+userData);
      if (response.status === 200) {
        toast.success(`User ${username} added successfully!`);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error(`User cannot be added! Try with different Email or User Name`);
    }
  }
};
// Create an object with the updated data
// const userData = {
//   username: username,
//   password: password
// };

// else {
//Login to check Null for all 3 fields


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const MAX_LOGIN_ATTEMPTS = 2; // Set the maximum number of login attempts

const loginUser = async (username, password) => {

  if (!username || !password) {
    toast.error('Please fill in all fields.');
    return;
  }

  const xsrfToken = getCookie('XSRF-TOKEN');

  const config = {
    withCredentials: true, // This is important to include cookies in the request
    headers: {
      'Authorization': 'Basic ' + btoa('admin:admin'),
      'X-XSRF-TOKEN': xsrfToken, // Include the XSRF token in the headers
    },
  };

  const fff = "username=" + username + "&password=" + password + "&_csrf=" + xsrfToken;

  let loginAttempts = 0;

  while (loginAttempts < MAX_LOGIN_ATTEMPTS) {
    try {
      console.log("/login" + fff + config);
      const response = await axios.post('/login', fff, config);
      console.log(response);

      if (response.status === 200) {
        toast.success(`User ${username} logged in!`);
        break; // Successful login, exit the loop
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      // Increment the login attempts and retry
      loginAttempts++;
      if (loginAttempts < MAX_LOGIN_ATTEMPTS) {
        console.error(`Login attempt ${loginAttempts} failed: ${error.message}`);
      } else {
        toast.error(`Your email or password is wrong!`);
      }
    }
  }
};



const LoginWrapper = () => {
  const [signUp, setSignUp] = useState(false);
  const [signupInputsState, setSignupInputsState] = useState(signupInputs);
  const [loginInputsState, setLoginInputsState] = useState(loginInputs);

  const inUpClick = () => {
    setSignUp(!signUp);
    animateFields('signupInputs');
    setTimeout(() => {
      animateFields('loginInputs');
    }, 100);
  };

  const animateFields = (formName) => {
    let start, length, newForm;

    if (formName === 'loginInputs') {
      newForm = [...loginInputsState];
    } else if (formName === 'signupInputs') {
      newForm = [...signupInputsState];
    }

    start = 0;
    length = newForm.length;

    const stagger = (i) => {
      if (i < length) {
        setTimeout(() => {
          newForm[i].show = !newForm[i].show;
          if (formName === 'loginInputs') {
            setLoginInputsState(newForm);
          } else if (formName === 'signupInputs') {
            setSignupInputsState(newForm);
          }
          stagger(i + 1);
        }, 70);
      }
    };

    stagger(start);
  };

  const submitSignupForm = (e) => {
    e.preventDefault();

    // Capture the username, email, and password values
    const usernameField = signUp
      ? signupInputsState.find((field) => field.id === 'c')
      : loginInputsState.find((field) => field.id === 'a');

    const emailField = signUp
      ? signupInputsState.find((field) => field.id === 'd')
      : null; // Email field is only available in signup form

    const passwordField = signUp
      ? signupInputsState.find((field) => field.id === 'e')
      : loginInputsState.find((field) => field.id === 'b');


    const confirmPasswordField = signUp
      ? signupInputsState.find((field) => field.id === 'f')
      : null; // Email field is only available in signup form


    const username = usernameField.validated;
    const email = emailField ? emailField.validated : '';
    const password = passwordField.validated;
    const confirmPassword = confirmPasswordField.validated;
    createUser(username, password, email, confirmPassword);
  };
  const submitLoginForm = (e) => {
    e.preventDefault();

    // Capture the username, email, and password values
    const usernameField = signUp
      ? signupInputsState.find((field) => field.id === 'c')
      : loginInputsState.find((field) => field.id === 'a');

    const passwordField = signUp
      ? signupInputsState.find((field) => field.id === 'e')
      : loginInputsState.find((field) => field.id === 'b');



    const username = usernameField.validated;
    const password = passwordField.validated;
    console.log(username, password)

    loginUser(username, password);

    // Logic for Login here
  };

  const validateField = (event, id) => {
    const value = event.target.value;

    const getField = (field) => field.id === id;

    let newState, fieldInState;

    if (signUp === true) {
      newState = [...signupInputsState];
      fieldInState = newState.find(getField);
      fieldInState.validated = value; // Store the entered value
      setSignupInputsState(newState);
    } else {
      newState = [...loginInputsState];
      fieldInState = newState.find(getField);
      fieldInState.validated = value; // Store the entered value
      setLoginInputsState(newState);
    }
  };


  return (
    <div>
      <ToastContainer />

      <Login
        signUp={signUp}
        inputs={loginInputsState}
        inUpClick={inUpClick}
        submitForm={submitLoginForm}
        validateField={validateField}
      />

      <SignUp
        signUp={signUp}
        inputs={signupInputsState}
        inUpClick={inUpClick}
        submitForm={submitSignupForm}
        validateField={validateField}
      />
    </div>

  );
};

const Login = ({ inputs, signUp, inUpClick, submitForm, validateField }) => (
  <div className={signUp ? 'login login-closed' : 'login'}>
    <h1>Log In</h1>
    <hr />
    <Form inputs={inputs} submitForm={submitForm} validateField={validateField} />
    <SignupLink inUpClick={inUpClick} />
    <div id='google'>
      <button type="button" className="login-with-google-btn">
        Sign in with Google
      </button>
    </div>

  </div>
);

const SignUp = ({ inputs, signUp, inUpClick, submitForm, validateField }) => (
  <div className={signUp ? 'sign-up' : 'sign-up sign-up-closed'}>
    <h1>Sign Up</h1>
    <hr />
    <Form inputs={inputs} submitForm={submitForm} validateField={validateField} />
    <LoginLink inUpClick={inUpClick} />
  </div>
);

const Form = ({ inputs, submitForm, validateField }) => {
  const inputsMapped = inputs.map((i) => (
    <Input
      key={i.id}
      label={i.label}
      type={i.type}
      show={i.show}
      validated={i.validated}
      id={i.id}
      validateField={validateField}
    />
  ));

  return (
    <form onSubmit={submitForm}>
      {inputsMapped}
      <Submit />
    </form>
  );
};

const Submit = () => (
  <div>
    <hr />
    <button className="submit-button" type="submit">
      Submit
    </button>
  </div>
);

const Input = ({ label, type, show, validated, id, validateField }) => (
  <div className={show ? 'field field-in' : 'field'}>
    <label className="label">
      {label} <i className={validated ? 'fa fa-check animate-check' : ''} aria-hidden="true" />
    </label>
    <br />
    <input className="input" type={type} onBlur={(event) => validateField(event, id)} />
  </div>
);

const SignupLink = ({ inUpClick }) => (
  <div className="signup-link">
    <p className="in-out">
      Don't have an account? <a href="#!" onClick={inUpClick}>Sign Up Here</a>
    </p>
  </div>
);

const LoginLink = ({ inUpClick }) => (
  <div className="signup-link">
    <p className="in-out">
      Already have an account? <a href="#!" onClick={inUpClick}>Log In Here</a>
    </p>
  </div>
);

export default LoginWrapper;
