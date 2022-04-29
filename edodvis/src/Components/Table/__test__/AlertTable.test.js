import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import AlertTable from '../AlertTable';
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const mockData =[
        {   daysDown: "471 days",
            isAlert: false,
            noMotion: true,
            pid: 9009,
            toInclude: true,
            type: "beacon, bed, door, gateway, miband, motion"
        }, 
        {   daysDown: "466 days",
            isAlert: false,
            noMotion: true,
            pid: 9010,
            toInclude: true,
            type: "beacon, bed, door, gateway, miband, motion",
        }, 
    ]

const Table = () => {
    return( 
        <BrowserRouter>
        <AlertTable 
            rowsPerPage={3}
            data={mockData}
            isLoading={false}
            resetPage={true}
            remarks={[]}
            minheight="300px"   
        />
        </BrowserRouter>   
    )
}   

test("Renders alert table successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table/> , div);
    ReactDOM.unmountComponentAtNode(div);
})

describe('render tables with details successfully', () => {
    it("should render houses details", async () => {
        render(<Table/>)

        const participantId = await screen.findAllByText(/participant id/i)
        const daysDown = await screen.findAllByText(/days down/i)
        const remarks = await screen.findAllByText(/view remark/i)
        const viewDetails = await screen.findAllByText(/view details/i)

        expect(participantId).toHaveLength(2)
        expect(daysDown).toHaveLength(2)
        expect(remarks).toHaveLength(2)
        expect(viewDetails).toHaveLength(2)
    })
})