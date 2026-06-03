import { HashRouter, Route, Switch } from "react-router-dom";
import { AuditsPage } from "./audits/AuditsPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route render={() => <AuditsPage />} />
            </Switch>
        </HashRouter>
    );
}
