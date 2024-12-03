import { SmoothiesProvider } from "../context"
import {Route, Routes} from 'react-router-dom'
import { ListSmoothiesView } from "../ListSmoothies/ListSmoothiesView"
import { CreateEditSmoothieView } from "../CreateEditSmoothie/CreateEditSmoothieView"
import { SmoothieDetailsView } from "../SmoothieDetails/SmoothieDetailsView"
import { AllergyFilterView } from "../AllergyFilter/AllergyFilterView"

const SmoothiesRoutes = () => {
    return (
        <SmoothiesProvider>
            <Routes>
                <Route path="/" element={<ListSmoothiesView/>}/>
                <Route path="new" element={<CreateEditSmoothieView/>} />
                <Route path="edit/:id" element={<CreateEditSmoothieView/>} />
                <Route path=":id" element={<SmoothieDetailsView/>} />
                <Route path="allergies" element={<AllergyFilterView/>} />
            </Routes>
        </SmoothiesProvider>
    )
}

export default SmoothiesRoutes;