import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Grid, Header, Icon, Label, Message, Segment } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form' 
import TextInput from '../Common/Form/TextInput'
import { RootStoreContext } from '../../Stores/rootStore'
import { IUserFormValues } from '../../Models/users'
import { FORM_ERROR } from 'final-form'
import { combineValidators, isRequired } from 'revalidate'
import { isReaction } from 'mobx/dist/internal'

const Login = () => {
  
  const validate = combineValidators({
    email: isRequired('Email'),
    password: isRequired('Password')
  })

  const rootStore = useContext(RootStoreContext)
  const navigate = useNavigate()
  const { login, setNavigate } = rootStore.userStore
  const handleSubmitForm = async (values: IUserFormValues) => {
    console.log('Submit login form with:', values);
    return login(values).catch((error) => ( {[FORM_ERROR]: error }))
  } 
  const { createHubConnection, stopHubConnection } = rootStore.commonStore

  useEffect(() => {
    setNavigate(navigate)
  },[navigate, setNavigate])

  useEffect(() => {
    createHubConnection()

    /*return() => {
      stopHubConnection()
    }*/
  },[])

  return (
    <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="violet" textAlign='center'>
          <Icon name="code branch" color="violet"/>
        </Header>

        <FinalForm validate={validate}  onSubmit={handleSubmitForm} render={( {handleSubmit, submitting, form, submitError}) => 
        {
          const { errors = {}, values = {}  } = form.getState()
          const typedValues = values as Record<string, string>;
          const requiredFields = Object.keys(values);
          const allFieldsFilled = requiredFields.every(
            (key) => typedValues[key] && typedValues[key].trim() !== ""
          );
          const hasErrors = Object.keys(errors).length > 0;
          const invalidInputs = !allFieldsFilled || hasErrors;

          return (
            <Form onSubmit={handleSubmit} size="large">
              <Segment stacked>
                <Field name="email" component={TextInput} placeholder="Email Address" type="text" icon="mail icon"/>
                <Field name="password" placeholder="Password" type="password" icon="lock icon" component={TextInput} />
                <Button color="violet" fluid size="large" disabled={submitting || (invalidInputs)}>
                  Submit
                </Button>
                {submitError && (<Label color="red" basic content={submitError.status===401? "Unauthorized" : "" }/>)}
                {/*<pre style = {{textAlign: "left"}}>{JSON.stringify(form.getState(), undefined, 2)}</pre>*/}
              </Segment>
            </Form> 
          );
        }}
        /> 
        <Message>
                Don't have an account? <Link to="/register">Register</Link>
        </Message>


      </Grid.Column>
    </Grid>
  )
}

export default Login
