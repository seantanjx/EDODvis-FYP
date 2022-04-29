import ReactDOM from 'react-dom'
import {render, cleanup} from '@testing-library/react'
import LoadingAnimation from '../LoadingAnimation'

afterEach(cleanup)

it ("Renders loading animation successfully", () => {
  const div = document.createElement("div")
  ReactDOM.render(<LoadingAnimation />, div)
  ReactDOM.unmountComponentAtNode(div)
})