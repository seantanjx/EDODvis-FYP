import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import FilterProfileMobile from "../FilterProfileMobile";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const areaOptions = ['Yishun','Jurong']

const ProfileMobile = () => {
    return( 
        <BrowserRouter>
        <FilterProfileMobile
            valueAge = {66}
            valueGender = "F"
            areaOptions = {areaOptions}
            reset={false}
        />
        </BrowserRouter>   
    )
}   

test("Renders profile filter mobile version successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ProfileMobile/> , div);
    ReactDOM.unmountComponentAtNode(div);
})
