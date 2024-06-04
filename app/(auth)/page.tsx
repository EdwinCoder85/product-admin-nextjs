import Logo from '@/components/logo';
import { Metadata } from "next";
import SignInForm from './components/sign-in.form';

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to get access to your product list",
};

const AuthPage = () => {
  return (
    <div className="flex justify-center items-center md:h-[95vh] md:px-10 lg:px-26">
      <div className="container h-[85vh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/*===========Image===========*/}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
          <div className="bg-auth absolute inset-0"></div>
          <Logo />

          <div className="relative z-20 mt-auto">
            <p className="text-lg">
              This web application helps me to make my life easy
            </p>
            <footer className="text-sm">EdwinCoder85</footer>
          </div>
        </div>

        {/*===========Forn===========*/}
        <div className="pt-10 lg:p-8 flex items-center md:h-[70vh]">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <SignInForm />
          </div>
        </div>
      </div>


    </div>
  );
};

export default AuthPage;
