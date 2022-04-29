import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import Statistics from '../Statistics';
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const mockData = { forgottenWallet:
                    { date: 
                        {
                            0: "2021-12-01", 1: "2021-12-02", 2: "2021-12-03", 3: "2021-12-04", 4: "2021-12-05", 5: "2021-12-06",
                            6: "2021-12-07", 7: "2021-12-08", 8: "2021-12-09", 9: "2021-12-10", 10: "2021-12-11", 11: "2021-12-12", 
                            12: "2021-12-13", 13: "2021-12-14", 14: "2021-12-15", 15: "2021-12-16", 16: "2021-12-17", 17: "2021-12-18", 
                            18: "2021-12-19", 19: "2021-12-20", 20: "2021-12-21", 21: "2021-12-22", 22: "2021-12-23", 23: "2021-12-24", 
                            24: "2021-12-25", 25: "2021-12-26", 26: "2021-12-27", 27: "2021-12-28", 28: "2021-12-29", 29: "2021-12-30", 
                            30: "2021-12-31",
                        }, 
                      length: 31,
                      value:
                        {
                            0: null, 1: null, 2: null, 3: null, 4: null,  5: null,
                            6: null, 7: null, 8: null, 9: null, 10: null , 11: null, 
                            12: 0, 13: 1, 14: null , 15: 0, 16: 1, 17: 2, 
                            18: 0, 19: 1, 20: null , 21: 0, 22: 1, 23: 2, 
                            24: 0, 25: 1, 26: null , 27: 0, 28: 1, 29: 2, 
                            30: 0,
                        }
                    }
                }


const Stats = () => {
    return( 
        <BrowserRouter>
        <Statistics
            average={mockData}
            date= "Dec 2021"
            participant={9001} 
        />
        </BrowserRouter>   
    )
}   

test("Renders statistic table successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <Stats /> , div);
    ReactDOM.unmountComponentAtNode(div);
})

describe('render correct month of interest', () => {
    it("should render correct month", () => {
        render(<Stats />)

        const dateElement = screen.getByTestId(/statsmonth/i)
        expect(dateElement).toBeVisible()
    })
})