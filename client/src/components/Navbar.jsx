//In React (with react-router-dom), navigation means changing the URL and showing a different component without reloading the page ie no page refresh, just component switching

import React from "react";
import logo_name from "../assets/logo_name.png"; //for importing logo and other assets
import { useNavigate } from "react-router-dom"; //hook for navigation and used to change pages programmatically, it basically gives a function
import { ArrowRight } from "lucide-react";  //for importing the arrow icon from lucide-react library which we have installed for using icons in our project
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'; //useClerk is a hook that gives us access to the Clerk context, which contains information about the current user and authentication state, it also provides functions for signing in, signing out, and other authentication-related actions. UserButton is a component that displays the user's profile picture and name, and when clicked, it shows a dropdown menu with options for signing out and managing the account. useUser is a hook that gives us access to the current user's information, such as their name, email, and profile picture, we can use this information to display the user's name or profile picture in the navbar, or to conditionally render different components based on whether the user is signed in or not.
import Logo from "./Logo";

const Navbar = () => {
    const navigate = useNavigate();  //initializes navigation function, now we can do navigate('/somepath'), navigate is basically means go to this route when i tell you, eg-navigate("/ai") it changes url to /ai and react router loads the correct component without refreshing the page, it just changes the component on the page, it does not reload the whole page, this is what makes react apps fast and smooth, because we are not doing a full page reload, we are just changing the component that is being rendered based on the URL, this is one of the main features of single page applications (SPAs) like those built with React.
    const {user} = useUser();
    const { openSignIn } = useClerk(); //openSignIn is a function provided by the useClerk hook that allows us to open the sign-in modal when the user clicks the "Get started" button, it is used to trigger the sign-in process for users who are not currently signed in, when the user clicks the button, it will open a modal where they can enter their credentials to sign in or create an account(basically this function opens clerk login popup).
  return (
    <div className='fixed z-50 w-full bg-zinc-950 border-b border-zinc-800 flex items-center justify-between h-16 px-4 sm:px-20 xl:px-32'>
      {/* <img src={logo_name} alt="Evora" className="h-8 w-auto cursor-pointer" onClick={() => navigate("/")} /> */}
      <Logo />
      <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
        <a href="#tools" className="hover:text-zinc-100 transition-colors">Tools</a>
        <a href="#community" className="hover:text-zinc-100 transition-colors">Community</a>
        <a href="#plans" className="hover:text-zinc-100 transition-colors">Plans</a>
      </nav>

      {
        user ?  
          <UserButton/> : (
          <button onClick={openSignIn} className="flex items-center gap-2 rounded-md text-sm cursor-pointer bg-cyan-400 text-zinc-900 px-4 py-2 font-medium hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300 transition-colors"> Get started <ArrowRight className="w-4 h-4" /></button>
        )
      }
    </div>
  );
};

export default Navbar;

