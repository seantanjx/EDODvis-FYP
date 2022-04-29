import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import RemarkModal from '../RemarkModal';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { useState } from 'react';
import { store } from "../../../Store/Store";

afterEach(cleanup)

export default function Remark() {

    const [open, setOpen] =  useState(false);

    return( 
        <Provider store={store}>
            <BrowserRouter>
                <RemarkModal
                    onClickClose={() => setOpen(false)}
                    remarks="device down"
                    sid='8'
                    sName='9001-ac:23:3f:56:e2:26'
                />
            </BrowserRouter>
        </Provider>   
    )
}   


test("Renders remark modal successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Remark/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

