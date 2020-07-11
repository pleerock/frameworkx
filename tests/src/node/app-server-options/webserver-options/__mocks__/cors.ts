import type cors from "cors"

export default jest.fn(jest.requireActual<typeof cors>("cors"))
