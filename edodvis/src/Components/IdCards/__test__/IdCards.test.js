import ReactDOM from "react-dom";
import {cleanup} from '@testing-library/react';
import IdCards from '../IdCards'
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const groupName = ['Participant 9001'];
const groupNameColour = ['#B5D5E2'];


const Id = () => {
    return( 
        <BrowserRouter>
        <IdCards
            GroupName = {groupName}
            GroupNameColour = {groupNameColour}
        />
        </BrowserRouter>   
    )
}   

test("Renders id cards successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Id/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

