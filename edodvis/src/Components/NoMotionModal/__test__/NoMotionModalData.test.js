import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import NoMotionModalData from '../NoMotionModalData';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { useState } from 'react';
import { store } from "../../../Store/Store";

afterEach(cleanup)

const NoMotionData = () => {
    return( 
        <Provider store={store}>
        <NoMotionModalData
        />
        </Provider>   
    )
}   


test("Renders no motion modal successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<NoMotionData/> , div);
    ReactDOM.unmountComponentAtNode(div);
})