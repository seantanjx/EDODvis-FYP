import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterBmMobile from '../FilterBmMobile'
import { BrowserRouter } from "react-router-dom";
import { CalendarContext } from "../../../Contexts/CalendarContext";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";


afterEach(cleanup)

const id = 'overview'


const FilterMobile = () => {

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
            <FilterBmMobile
                id={id}
            />
            </CalendarContext.Provider>   
        </Provider>

    )
}   

test("Renders filter mobile version successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<FilterMobile/> , div);
    ReactDOM.unmountComponentAtNode(div);
})