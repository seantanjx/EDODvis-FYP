import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterS from "../FilterS";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const areaOptions = ['Yishun','Jurong']

const dataFilter = {
    type:"", status:"", battery:"", area:""
  };

const SensorFilter = () => {
    return( 
        <Provider store={store}>
        <FilterS
            value={dataFilter}
            areaOptions = {areaOptions}
            reset={false}
            id='sensors'
        />
        </Provider>   
    )
}   

test("Renders sensor filter successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SensorFilter/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

