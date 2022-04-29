import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import SaveChanges from '../SaveChanges';
import { BrowserRouter } from "react-router-dom";
import { useState } from 'react';

afterEach(cleanup)




export default function Save() {
    const [openSaveChanges, setOpenSaveChanges] = useState(false);
    return( 
        <BrowserRouter>
        <SaveChanges
          open={openSaveChanges}  
          message="Changes has been saved"
          handleClose={() => setOpenSaveChanges(false)}      
        />
        </BrowserRouter>   
    )
}   

test("Renders save changes successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Save/> , div);
    ReactDOM.unmountComponentAtNode(div);
})
