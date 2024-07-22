import React from 'react'
import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'

const SignIn = () => {
  return (
    <div className='bg-slate-300 h-screen flex justify-center items-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
            <Heading label={"Sign In"}/>
            <SubHeading label={"Enter your credentials to access your account"}/>
            <InputBox placeholder={"dhirajudhani870@gmail.com"} label={"Email"}/>
            <InputBox placeholder={"123456"} label={"Password"}/>
            <div className='pt-4'>
                <Button label={"Sign In"}/>
            </div>
            <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}/>
        </div>
    </div>
  )
}

export default SignIn