import { SmoothiesProvider } from "../context"
import {Route, Routes} from 'react-router-dom'
import { ListSmoothiesView } from "../ListSmoothies/ListSmoothiesView"

const SmoothiesRoutes = () => {
    return (
        <SmoothiesProvider>
            <Routes>
                <Route path="/" element={<ListSmoothiesView/>}/>
                <Route path="/new" element={"Create New Smoothie"} />
                <Route path="/edit/:id" element={"Edit Smoothie"} />
                <Route path="/:id" element={"Smoothie Details"} />
            </Routes>
        </SmoothiesProvider>
    )
}

export default SmoothiesRoutes;