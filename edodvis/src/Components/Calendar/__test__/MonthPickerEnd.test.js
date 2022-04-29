import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import MonthPickerEnd from '../MonthPickerEnd'
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'overview';


const MonthEndCalendar = () => {
    return( 
        <Provider store={store}>
        <MonthPickerEnd
            id = {id}
        />
        </Provider>   
    )
}   

test("Renders day calendar successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <MonthEndCalendar /> , div);
    ReactDOM.unmountComponentAtNode(div);
})