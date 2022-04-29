import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import PageBreadcrumb from "../PageBreadcrumb";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const crumbs = [
    { pageLink: "/biomarkersoverview", pageName: "Biomarker Overview" },
  ];


const Crumb = () => {
    return( 
        <BrowserRouter>
        <PageBreadcrumb
            crumbs = {crumbs}
        />
        </BrowserRouter>   
    )
}   

test("Renders page bread crumb successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Crumb/> , div);
    ReactDOM.unmountComponentAtNode(div);
})