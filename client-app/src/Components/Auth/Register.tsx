import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, Grid, Header, Icon, Label, Message, Segment } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form' 
import { combineValidators, isRequired } from 'revalidate'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IUserFormValues } from '../../Models/users'
import { RootStoreContext } from '../../Stores/rootStore'
import { FORM_ERROR } from 'final-form'
import TextInput from '../Common/Form/TextInput'
import Footer from '../../Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Register = () => {
  const validate = combineValidators({
    email: isRequired('Email'),
    password: isRequired('Password'),
    passwordConfirmation: isRequired('Password Confirmation'),
    username: isRequired('Email')
  })
  const rootStore = useContext(RootStoreContext)
  const navigate = useNavigate()
  const { register, setNavigate} =rootStore.userStore
  
  const handleSubmitForm = async (values: IUserFormValues) => {
    console.log("hola1")
    return register(values).catch((error) => ( {[FORM_ERROR]: error }))
  } 
  
  useEffect(() => {
    setNavigate(navigate)
  },[navigate, setNavigate])
  

  return (
    <>
     <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign='center'>
            <Icon name="puzzle piece" color="orange" />
            Register for NetChat
          </Header>
          <FinalForm validate={validate}  onSubmit={handleSubmitForm} render={( {handleSubmit, submitting, form, submitError}) => 
          {
            return (
              <Form size="large" onSubmit={handleSubmit}>
                <Segment stacked>
                  <Field fluid component={TextInput} name="username" icon="user icon" iconPosition='left' placeholder="Username" type="text" />
                  <Field fluid component={TextInput} name="email" icon="mail icon" iconPosition='left' placeholder="Email Address" type="email" />
                  <Field fluid component={TextInput} name="password" icon="lock icon" iconPosition='left' placeholder="Password" type="password" />
                  <Field fluid component={TextInput} name="passwordConfirmation" icon="lock icon" iconPosition='left' placeholder="Password Confirmation" type="password" />
                  <Button color="orange" fluid size="large">
                    Submit
                  </Button>
                  {submitError && (<Label color="red" basic content={submitError.status===401? "Unauthorized" : "" }/>)}
                </Segment>
              </Form>
            );
            }}
            /> 
            <Message>
              Alredy a user? <Link to="/login">Login</Link>
            </Message>
        </Grid.Column>
      </Grid>

      <Footer />
    </>
  )
}

export default Register
