import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { FaUserCircle } from "react-icons/fa";

function Header() {
  const { user, isSignedIn } = useUser();
  {
    /* <div className='p-3 px-5 flex justify-between shadow-md'>
             <Link to={'/dashboard'}>
            <img src='/logo.s' className='cursor-pointer' width={100} height={100} />
            </Link>
            {isSignedIn ?
                <div className='flex gap-2 items-center'>
                    <Link to={'/dashboard'}>
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    <UserButton />
                </div> :
                <Link to={'/auth/sign-in'}>
                    <Button>Get Started</Button>
                </Link>
            }


             <nav className="shadow-lg mb-4 py-5 bg-[#3A60D0] ">
        <div className="container mx-auto flex justify-between items-center">
          
          <Link to={"/dashboard"} className='gap-5'>
            <Button  variant="outline">Dashboard</Button>
          </Link>

          <FaUserCircle size={35} className="text-white mr-3" />
          <button className="ml-auto mr-3 bg-transparent border border-white text-white rounded-full px-6 py-2 font-medium">
            Logout
          </button>
        </div>
      </nav>
        </div> */
  }
  return (
    <div className="main-content pt-8 ">
      <nav className="shadow-lg mb-4 py-5 bg-[#3A60D0] ">
          
        <Link to={'/dashboard'}>
            </Link>
            {isSignedIn ?
                        <div className="container mx-auto flex justify-between items-center">

                    <Link to={'/dashboard'}>
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    <UserButton />
                </div> :
                <Link to={'/http://localhost:3000/login'}>
                              

                </Link>
            }

      
      </nav>
    </div>
  );
}

export default Header;
