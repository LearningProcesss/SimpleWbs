import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useAuthContext } from '../hooks/authcontext';
import { Formik } from 'formik';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Login() {

  const { signin } = useAuthContext();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ margin: 2, padding: 2, width: '50%' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Signin" {...a11yProps(0)} />
            <Tab label="Signup" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Formik initialValues={{ email: '', password: '' }} onSubmit={(values, { setSubmitting }) => {
            console.log("signin clicked", values);
            signin(values.email, values.password);
          }}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2em" }}>
                  <TextField required id="email" label="Email" type="email" onChange={handleChange} />
                  <TextField id="password" label="Password" type="password" onChange={handleChange} autoComplete="current-password" />
                  <Button variant="contained" type="submit">Signin</Button>
                </div>
              </form>

            )}
          </Formik>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* <div style={{ display: "flex", flexDirection: "column", gap: "2em" }}>
            <TextField required id="name" label="Name" type="text" onChange={handleFormInput} />
            <TextField required id="surname" label="Surname" type="text" onChange={handleFormInput} />
            <TextField required id="emailsignup" label="Email" type="email" onChange={handleFormInput} />
            <TextField id="passwordsignup" label="Password" type="password" onChange={handleFormInput} autoComplete="current-password" />
            <Button variant="contained" onClick={onSignupClick}>Signup</Button>
          </div> */}
        </TabPanel>
      </Box>
    </Card>
  );
}
