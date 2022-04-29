import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import SensorCards from '../SensorCards';

afterEach(cleanup)

test("Renders sensor card successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <SensorCards 
                        data={10}
                        text="motion"
                        contentClassName="sensorContent"
                        id="motionLowBattery"
                        sx={{ backgroundColor: "#F5E2E4", m: 0, p: 0 }}
                      /> 
                    , div);
    ReactDOM.unmountComponentAtNode(div);
})

describe('render correct card content', () => {
    it("should render correct count", () => {
        render(<SensorCards 
                    data={10}
                    text="motion"
                    contentClassName="sensorContent"
                    id="motionLowBattery"
                    sx={{ backgroundColor: "#F5E2E4", m: 0, p: 0 }}
                />)

        const dataCount = screen.getByText(/10/i)    
        expect(dataCount).toBeVisible()
      
    })
})