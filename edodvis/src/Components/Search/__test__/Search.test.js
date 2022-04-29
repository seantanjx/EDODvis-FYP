import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import Search from '../Search';

afterEach(cleanup)

const mockOptions = ['9001', '9002', '9003']

test("Renders search component successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <Search
                        placeholder="Search by Participant Id"
                        className="searchDesktop"
                        value={""}
                        options={mockOptions}
                      /> 
                    , div);
    ReactDOM.unmountComponentAtNode(div);
})
