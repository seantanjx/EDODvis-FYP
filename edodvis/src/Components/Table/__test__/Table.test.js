import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import Table from '../Table';
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup)

const mockData =[
        {   age: 72,
            area: 4,
            gender: "M",
            id: 9001,
        }, 
        {   age: 12,
            area: 4,
            gender: "M",
            id: 9002,
        }, 
    ]

const DataTable = () => {
    return( 
        <BrowserRouter>
        <Table 
            isLoading={false}
            rows={mockData}
            columns={[
                { field: 'id', headerName: 'Participant ID', flex: 1},
                { field: 'age', headerName: 'Age', flex: 1}, 
                { field: 'gender', headerName: 'Gender', flex: 1},
                { field: "Route",
                  headerName: "",
                  flex: 1,
                  renderCell: (cellValues) => {
                  return <Link onClick={handleLink} name={cellValues.id} className="link">View Chart</Link>
                  }
                }              
              ]}    
              filename="Profile Data" 
              fields={['id', 'age', 'gender']}
              resetPage={true}    
        />
        </BrowserRouter>   
    )
}   

test("Renders data table successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DataTable/> , div);
    ReactDOM.unmountComponentAtNode(div);
})