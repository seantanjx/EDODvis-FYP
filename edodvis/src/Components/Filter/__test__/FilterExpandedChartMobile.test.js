import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterExpandedChartMobile from '../FilterExpandedChartMobile'
import { BrowserRouter } from "react-router-dom";
import { CalendarContext } from "../../../Contexts/CalendarContext";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'overview'

const FilterExpandedMobile = () => {

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
            <FilterExpandedChartMobile
                id={id}
            />
            </CalendarContext.Provider>   
        </Provider>

    )
}   

test("Renders expanded filter mobile version successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<FilterExpandedMobile/> , div);
    ReactDOM.unmountComponentAtNode(div);
})