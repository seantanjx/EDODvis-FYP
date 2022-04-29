import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import NoMotionModal from '../NoMotionModal';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { useState } from 'react';
import { store } from "../../../Store/Store";

afterEach(cleanup)

const NoMotion = () => {
    return( 
        <Provider store={store}>
            <BrowserRouter>
                <NoMotionModal/>
            </BrowserRouter>
        </Provider>   
    )
}   


test("Renders no motion modal successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<NoMotion/> , div);
    ReactDOM.unmountComponentAtNode(div);
})