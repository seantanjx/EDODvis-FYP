import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import GroupNameModal from '../GroupNameModal';


afterEach(cleanup)

test("Renders Compare Group Card successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <GroupNameModal
                        group= {0}
                        cardTitle="hello test"
                    />
                    , div);
    ReactDOM.unmountComponentAtNode(div);
})

