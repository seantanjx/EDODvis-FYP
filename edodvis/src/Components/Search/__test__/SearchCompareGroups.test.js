import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import SearchCompareGroups from '../SearchCompareGroups';

afterEach(cleanup)

const mockOptions = ['9001', '9002', '9003']

test("Renders search component successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <SearchCompareGroups
                        placeholder="Search by Participant Id"
                        value={""}
                        options={mockOptions}
                      /> 
                    , div);
    ReactDOM.unmountComponentAtNode(div);
})
