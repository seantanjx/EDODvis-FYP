import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import ChangesModal from '../ChangesModal';
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const Modal = () => {
    return( 
        <BrowserRouter>
        <ChangesModal
              text="Confirm Update?"
        />
        </BrowserRouter>   
    )
}   

test("Renders modal successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Modal/> , div);
    ReactDOM.unmountComponentAtNode(div);
})