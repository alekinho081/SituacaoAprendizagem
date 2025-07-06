import React from "react";
import NewHeader from "../Components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";


const Layout = () => {
    return(
        <div>
                <NewHeader />
               
                <main>

                    <Outlet />

                </main>

              <footer>

                   <Footer/>

              </footer>

        </div>

    )
}

export default Layout