import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";
import WeeklyDatePickerStart from '../WeeklyDatePickerStart';

afterEach(cleanup)

const id = 'overview';


const WeekStartCalendar = () => {
    return( 
        <Provider store={store}>
        <WeeklyDatePickerStart
            id = {id}
        />
        </Provider>   
    )
}   

test("Renders day calendar successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <WeekStartCalendar /> , div);
    ReactDOM.unmountComponentAtNode(div);
})