import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";

import LandingPage from "./Pages/Landing"
import OrphanagesMapPage from "./Pages/OrphanagesMap"
import Orphanage from "./Pages/Orphanage"
import CreateOrphanage from "./Pages/CreateOrphanage"

function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/map" component={OrphanagesMapPage} />
                <Route path="/orphanages/create" component={CreateOrphanage} />
                <Route path="/orphanages/:id" component={Orphanage} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes