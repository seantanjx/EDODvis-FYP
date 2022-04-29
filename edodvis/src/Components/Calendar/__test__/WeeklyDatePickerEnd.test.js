import ReactDOM from "react-dom";
import { cleanup} from '@testing-library/react';
import WeeklyDatePickerEnd from '../WeeklyDatePickerEnd';
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";

afterEach(cleanup)

const id = 'overview';


const WeekEndCalendar = () => {
    return( 
        <Provider store={store}>
        <WeeklyDatePickerEnd
            id = {id}
        />
        </Provider>   
    )
}   

test("Renders day calendar successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <WeekEndCalendar /> , div);
    ReactDOM.unmountComponentAtNode(div);
})