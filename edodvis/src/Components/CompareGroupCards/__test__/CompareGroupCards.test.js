import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import CompareGroupCards from '../CompareGroupCards';


afterEach(cleanup)

test("Renders Compare Group Card successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <CompareGroupCards
                        group= {0}
                        registerChecked= {true}
                        registerNameChange="hello"
                        data={{data: [9001, 9002]}}
                        cardTitle="hello test"
                        color="#B5D5E2"
                        sx={{ alignItems: "stretch" }}
                    />
                    , div);
    ReactDOM.unmountComponentAtNode(div);
})

