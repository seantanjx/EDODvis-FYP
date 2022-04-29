import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import FilterParticipantCharts from '../FilterParticipantCharts'
import { BrowserRouter } from "react-router-dom";
import { CalendarContext } from "../../../Contexts/CalendarContext";
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'individual'

const FilterIndividual = () => {

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
            <FilterParticipantCharts
                id={id}
            />
            </CalendarContext.Provider>   
        </Provider>

    )
}   

test("Renders participant filter successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<FilterIndividual/> , div);
    ReactDOM.unmountComponentAtNode(div);
})