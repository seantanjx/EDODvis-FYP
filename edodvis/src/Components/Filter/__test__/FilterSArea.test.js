import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterSArea from "../FilterSArea";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const areaOptions = ['Yishun','Jurong']

const SensorFilterByArea = () => {
    return( 
        <BrowserRouter>
        <FilterSArea
            options = {areaOptions}
            reset = {false}
        />
        </BrowserRouter>   
    )
}   

test("Renders sensor filter by area successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SensorFilterByArea/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

