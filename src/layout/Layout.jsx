import React from "react";
import NewHeader from "../Components/Header/Header";
import { Outlet } from "react-router-dom";


const Layout = () => {
    return(
        <div>
                <NewHeader />
               
                <main>

                    <Outlet />

                </main>

              <footer>

                    <p>© 2025 </p>

              </footer>

        </div>

    )
}

export default Layout