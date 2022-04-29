import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterBm from '../FilterBm'
import { BrowserRouter } from "react-router-dom";
import { CalendarContext } from "../../../Contexts/CalendarContext";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";


afterEach(cleanup)

const id = 'overview'


const Filter = () => {

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
            <FilterBm
                id={id}
            />
            </CalendarContext.Provider>   
        </Provider>

    )
}   

test("Renders filter successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Filter/> , div);
    ReactDOM.unmountComponentAtNode(div);
})