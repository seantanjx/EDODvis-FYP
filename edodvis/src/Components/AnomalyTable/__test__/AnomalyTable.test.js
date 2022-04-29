import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import AnomalyTable from '../AnomalyTable';
import { BrowserRouter } from "react-router-dom";


const mockAnomaly = { "2021-12-01": 
    { date: 
        {
            0: [0],1: [2],2: [1],3: [3],4: [0],5: [1],
            6: [0], 7: [1], 8: [0], 9: [3], 10: [0], 11: [3], 12: [1],
            13: [1], 14: [0], 15: [0], 16: [2], 17: [1], 18: [1], 19: [0],
            20: [2], 21: [3], 22: [-5], 23: [2], 24: [3], 25: [3],
        }, 
      outlier: 
        {
            9002: [-5], 
        },
      threshold: [-2,4]
    }
}

const biomarkerData = { forgottenWallet:
    { date: 
        {
            0: "2021-12-01", 1: "2021-12-02", 2: "2021-12-03", 3: "2021-12-04", 
            4: "2021-12-05", 5: "2021-12-06", 
        }, 
      length: 31,
      value:
        {
            0: null, 1: 0, 2: 1, 3: 2, 4: 2,  5: 2,
        }
    }
}

const Table = () => {
    return(
        <BrowserRouter>
        < AnomalyTable 
            anomaly={mockAnomaly}
            dataset={biomarkerData}
            biomarker="forgottenMedication"
            colour= "#8634eb"
            periodicity="day"
            participantId={true}
            overview={true}
        /> 
        </BrowserRouter>
    )
}

afterEach(cleanup)

test("Renders anomaly table successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render( <Table />, div);
    ReactDOM.unmountComponentAtNode(div);
})

