import React from 'react';
import { Suspense } from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'

const SmoothiesRoutes = React.lazy(() => import('./Smoothies/routes/SmoothiesRoutes'))


const App = () => {
  return (
    <BrowserRouter>
    <Suspense fallback={<div>Loading Smoothies...</div>}>
    <Routes>
      {/*Smoothies*/}
      <Route path="/" element={<Navigate to="/smoothies" replace />} />
      <Route path="/smoothies/*" element={<SmoothiesRoutes/>}/>
    </Routes>
    </Suspense>
    </BrowserRouter>
  )
}

export default App;