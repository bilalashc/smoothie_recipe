import { SmoothiesProvider } from "../context"
import {Route, Routes} from 'react-router-dom'
import { ListSmoothiesView } from "../ListSmoothies/ListSmoothiesView"
import { CreateEditSmoothieView } from "../CreateEditSmoothie/CreateEditSmoothieView"

const SmoothiesRoutes = () => {
    return (
        <SmoothiesProvider>
            <Routes>
                <Route path="/" element={<ListSmoothiesView/>}/>
                <Route path="new" element={<CreateEditSmoothieView/>} />
                <Route path="edit/:id" element={<CreateEditSmoothieView/>} />
                {/* <Route path=":id" element={"Smoothie Details"} /> */}
            </Routes>
        </SmoothiesProvider>
    )
}

export default SmoothiesRoutes;