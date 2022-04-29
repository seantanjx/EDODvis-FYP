import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterExpandedChart from '../FilterExpandedChart'
import { BrowserRouter } from "react-router-dom";
import { CalendarContext } from "../../../Contexts/CalendarContext";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'overview'

const FilterExpanded = () => {

    const formData = {
        'overview':{
          period: 'month',
        },
        'individual':{
          period: 'month',
        },
        'groups':{
          period: 'month',
        }
      };

    return( 
        <Provider store={store}>
            <CalendarContext.Provider
                value={{formData}}>
            <FilterExpandedChart
                id={id}
            />
            </CalendarContext.Provider>   
        </Provider>

    )
}   

test("Renders expanded filter successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<FilterExpanded/> , div);
    ReactDOM.unmountComponentAtNode(div);
})