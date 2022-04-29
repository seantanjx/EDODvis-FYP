import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import LineChart from '../LineChart';
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const biomarkers = {
    heartRate:{
        date:["2021-11-01","2021-12-01","2022-01-01","2022-02-01","2022-03-01","2022-04-01"],
        value:[52,55,77,79,80,80]}
    };

const Line = () => {
    return( 
        <Provider store={store}>
            <BrowserRouter>
                <LineChart
                title='Heart Rate'
                labels={["2021-11-01","2021-12-01","2022-01-01","2022-02-01","2022-03-01","2022-04-01"]}
                data ={[52,55,77,79,80,80]}
                periodicity='month'
                colour="#AE1A2C"
                id='heartRate'
                true='false'
                biomarker={biomarkers}
                titleContainerClass="overviewCardTitle"
                graphClass="overviewCardContent"
                titleClass="overviewGraphTitle"
            />
            </BrowserRouter>

        </Provider>   
    )
}   

test("Renders line chart successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Line/> , div);
    ReactDOM.unmountComponentAtNode(div);
})


