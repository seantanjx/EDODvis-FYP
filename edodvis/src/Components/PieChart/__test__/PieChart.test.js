import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import PieChart from '../PieChart';
import { Provider } from "react-redux";
import { store } from "../../../Store/Store";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const pieChartLabels = [
    "High Battery",
    "Medium Battery",
    "Low Battery",
    "Offline devices",
  ];

var data = [100,80,50,0];

const Pie = () => {
    return( 
        <Provider store={store}>
                <BrowserRouter>
                    <PieChart
                        labels={pieChartLabels} 
                        data={data}
                />
                </BrowserRouter>
        </Provider>   
    )
}   

test("Renders bar chart successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Pie/> , div);
    ReactDOM.unmountComponentAtNode(div);
})
