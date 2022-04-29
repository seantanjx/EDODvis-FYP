import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterSMobile from "../FilterSMobile";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";
afterEach(cleanup)

const areaOptions = ['Yishun','Jurong']

const dataFilter = {
    type:"", status:"", battery:"", area:""
  };

const SensorFilterMobile = () => {
    return( 
        <Provider store={store}>
        <FilterSMobile
            value={dataFilter}
            areaOptions = {areaOptions}
            reset={false}
            id='sensors'
        />
        </Provider>   
    )
}   

test("Renders sensor filter mobile version successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SensorFilterMobile/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

