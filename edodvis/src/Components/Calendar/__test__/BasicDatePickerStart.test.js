import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import BasicDatePickerStart from '../BasicDatePickerStart'
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'overview';


const DayStartCalendar = () => {
    return( 
        <Provider store={store}>
        <BasicDatePickerStart
            id = {id}
        />
        </Provider>   
    )
}   

test("Renders day calendar successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <DayStartCalendar /> , div);
    ReactDOM.unmountComponentAtNode(div);
})

