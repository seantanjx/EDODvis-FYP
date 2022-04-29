import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import BasicDatePickerEnd from '../BasicDatePickerEnd'
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'overview';


const DayEndCalendar = () => {
    return( 
        <Provider store={store}>
        <BasicDatePickerEnd
            id = {id}
        />
        </Provider>   
    )
}   

test("Renders day calendar successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <DayEndCalendar /> , div);
    ReactDOM.unmountComponentAtNode(div);
})