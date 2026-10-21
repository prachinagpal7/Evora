import React from "react";
import { Route, Routes } from "react-router-dom";  //to use a react-router for navigation between different pages/components in the app. Routes-container for all routes, Route-defines a single route with a path and the component to render when that path is accessed.
import Home from './pages/Home' 
import Layout from './pages/Layout' 
import Dashboard from './pages/Dashboard' 
import WriteArticle from './pages/WriteArticle' 
import BlogTitles from './pages/BlogTitles' 
import GenerateImages from './pages/GenerateImages' 
import RemoveBackground from './pages/RemoveBackground' 
import RemoveObject from './pages/RemoveObject' 
import ReviewResume from './pages/ReviewResume' 
import Community from './pages/Community'
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
//Importing different pages (components).Each file represents a screen in your app.
import {Toaster} from 'react-hot-toast'  //we installed this by npm install react-hot-toast in the terminal bcz to show notifications ....instead of doing alert("Article Generated") which looks ugly, we do toast.success("Article Generated") and a nice popup appears 

//This is your main/root component. App defines the main structure of the application and sets up the routing for different pages. It uses the Routes component to define various routes and their corresponding components."/ai" route renders the Layout component, which contains nested routes for different AI-related features.
const App = () => {  
  
  const {getToken} = useAuth(); 

  useEffect(() => {
    getToken().then((token) => console.log(token));
  }, [])  //now we can remove it bcz we added only to test the backend

  return (
    <div>
      <Toaster position="top-right" gutter={8}
        toastOptions={{ duration: 3000,
          style: {
            background: "#18181b",
            color: "#e4e4e7",
            border: "1px solid #27272a",
            borderRadius: "6px",
            padding: "10px 14px",
            fontSize: "14px",
            fontWeight: 400,
            boxShadow: "none",
            maxWidth: "360px",
          },
          success: { iconTheme: { primary: "#22d3ee", secondary: "#18181b" },},
          error: { duration: 4000, iconTheme: { primary: "#f87171", secondary: "#18181b" },},
        }}
      /> {/*think of it as a notif manager, whenever we use toast.success(..) or error then react hot toast sends message to <Toaster /> and it displays popup, without <Toaster />, toast.success("Done") this does not work bcz there is nowhere to show it*/}
      <Routes> {/*This is where all routing happens. React Router checks the current URL and matches routes inside this to determine which component to render.*/}
        <Route path="/" element={<Home />} /> {/*Defines a route for the home page. When the user navigates to "/", the Home component will be rendered.*/}
        <Route path="/ai" element={<Layout />}> {/*This is a parent route, URL /ai loads Layout component, This route has children inside it*/}
          <Route index element={<Dashboard />} /> {/*index means default child route for /ai, So /ai shows Dashboard component by default when accessed without any additional path.*/}
          <Route path="write-article" element={<WriteArticle />} /> {/* /ai/write-article shows WriteArticle component inside the layout comonent*/}
          <Route path="blog-titles" element={<BlogTitles />} /> 
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} /> 
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route> {/*closing parent /ai route*/}
      </Routes>  {/*end of routing system*/}
    </div>
  );
};

export default App;  //make this component usable everywhere

//eg- user goes to /ai then react router sees the /ai and loads <Layout /> and inside Layout, it sees <Outlet /> since it's index route then it loads <Dashboard />. if user goes to /ai/write-article then it loads <Layout /> and inside it, <Outlet /> gets replaced by <WriteArticle /> so it loads <WriteArticle /> because of the path match.

//its like a youtube page where both navbar and sidebar is fixed and only the content changes. Here Layout is like the fixed part (navbar/sidebar) and the Outlet is where the content changes based on the route.
//if we remove the outlet then only the Layout component renders and the child routes (Dashboard, WriteArticle, etc.) will never render because there's no place for them to be displayed. The Outlet is essential for rendering the child components based on the nested routes.

//eg- Step 1: You click button: navigate("/ai/write-article"). Step 2: URL changes: /ai/write-article. Step 3: React Router checks routes, it matches: /ai → Layout and write-article → WriteArticle. Step 4: Rendering: Layout-Outlet → WriteArticle

//react router does not reload the page because it turns your app into a SPA(Single Page Application) that means: Only components change, and The browser does NOT refresh. it also does not change the url and reloads the page 

//outlet does not change url, reload page and trigger everything. it is just a placehollder ie child component yahan pe render karo 

//navigate() is the only one here that changes the url, After this routes react and outlet renders child 

//if you manually type the url in the browser, then page will reload because browser request happens but after load, React takes control again

//{} have 3 different uses:
// 1.Named imports(import { useNavigate } from 'react-router-dom')-it means giive me on;y useNavigate fro that library. 2.Default import(import React from 'react')-no {} because React is the default export like if there was 'export default AiToolsData' then we would use it without {}. 
// 2.Inside JSX to embed JavaScript expressions (e.g., <div>{someVariable}</div>) - here {} is used to evaluate JavaScript and render the result in the UI. Without {}, someVariable would be just a text string, not the value of the variable.
// 3.{} for objects (e.g., const obj = { key: 'value' }) - here {} is used to define an object in JavaScript.

// ./ means current folder, ../ means go one folder uplike going out of the current folder, ../../ means go two levels up, and so on. So if you are in src folder and want to import from src/pages, you can use ./pages. If you are in src/components and want to import from src/pages, you can use ../pages.