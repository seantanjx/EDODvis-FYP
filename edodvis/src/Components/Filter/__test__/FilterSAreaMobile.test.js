import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterSAreaMobile from "../FilterSAreaMobile";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const areaOptions = ['Yishun','Jurong']

const SensorFilterByAreaMobile = () => {
    return( 
        <BrowserRouter>
        <FilterSAreaMobile
            options = {areaOptions}
            reset = {false}
        />
        </BrowserRouter>   
    )
}   

test("Renders sensor filter by area mobile version successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SensorFilterByAreaMobile/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

