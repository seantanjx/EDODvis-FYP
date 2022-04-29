import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";
import MonthPickerStart from '../MonthPickerStart'

afterEach(cleanup)

const id = 'overview';


const MonthStartCalendar = () => {
    return( 
        <Provider store={store}>
        <MonthPickerStart
            id = {id}
        />
        </Provider>   
    )
}   

test("Renders day calendar successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <MonthStartCalendar /> , div);
    ReactDOM.unmountComponentAtNode(div);
})