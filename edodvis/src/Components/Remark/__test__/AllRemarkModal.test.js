import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import AllRemarkModal from '../AllRemarkModal';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { useState } from 'react';
import { store } from "../../../Store/Store";

afterEach(cleanup)

export default function AllRemark() {

    const [open, setOpen] =  useState(false);
    const remarks = {
        0: [9001,
        {9001:{days_down:1,remarks:null}}
            ]
    }

    return( 
        <Provider store={store}>
            <BrowserRouter>
                <AllRemarkModal
                    onClickClose={() => setOpen(false)}
                    remarks={remarks}
                    pid='9001'
                />
            </BrowserRouter>
        </Provider>   
    )
}   


test("Renders all remark modal successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<AllRemark/> , div);
    ReactDOM.unmountComponentAtNode(div);
})
