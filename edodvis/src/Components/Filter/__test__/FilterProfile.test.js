import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import FilterProfile from "../FilterProfile";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const areaOptions = ['Yishun','Jurong']

const Profile = () => {
    return( 
        <BrowserRouter>
        <FilterProfile
            valueAge = {66}
            valueGender = "F"
            areaOptions = {areaOptions}
            reset={false}
        />
        </BrowserRouter>   
    )
}   

test("Renders profile filter successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Profile/> , div);
    ReactDOM.unmountComponentAtNode(div);
})



