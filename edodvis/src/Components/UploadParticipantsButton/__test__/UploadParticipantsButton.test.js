import ReactDOM from "react-dom";
import { render, screen, cleanup} from '@testing-library/react';
import UploadParticipantButton from '../UploadParticipantsButton';

afterEach(cleanup)

test("Renders button successfully", () => {
    const div = document.createElement("div");
    ReactDOM.render(<UploadParticipantButton />, div);
    ReactDOM.unmountComponentAtNode(div);
})

describe('Render button successfully', () => {
    it("should render upload window", () => {
        render(<UploadParticipantButton />)
        const buttonElement = screen.getByText(/upload participants excel/i)
        expect(buttonElement).toBeInTheDocument()
    })
})