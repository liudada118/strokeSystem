import React, { Suspense } from 'react';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Loading } from './components/pageLoading';
import RequirAuthRoute from './components/auth/RequirAuthRoute';
// import RecordForm from './pages/equipDetail/RecordForm';
// import EditingUser from './pages/equipDetail/EditingUser';
// import TurnReport from './pages/turnReport/TurnReport';
// import UserInfoCard from './pages/equipDetail/UserInfoCard';

// import Message from './pages/message';
// import Setting from './pages/setting/Setting';
// import Login from './pages/login';
// import EquipDetail from './pages/equipDetail';

const Home = React.lazy(() => import('./pages/home/Home'))
const Login = React.lazy(() => import('./pages/login'))
const EquipDetail = React.lazy(() => import('./pages/equipDetail'))
const Setting = React.lazy(() => import('./pages/setting/Setting'))
const Message = React.lazy(() => import('./pages/message'))
const UserInfoCard = React.lazy(() => import('./pages/equipDetail/UserInfoCard'))
const TurnReport = React.lazy(() => import('./pages/turnReport/TurnReport'))
const EditingUser = React.lazy(() => import('./pages/equipDetail/EditingUser'))
const RecordForm = React.lazy(() => import('./pages/equipDetail/RecordForm'))

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/*" element={
            <RequirAuthRoute> <Home /></RequirAuthRoute>
          } />
          <Route path="/login" element={
            <RequirAuthRoute><Login /></RequirAuthRoute>
          } />
          <Route path="/message" element={
            <RequirAuthRoute> <Message /></RequirAuthRoute>
          } />
          <Route path="/setting" element={
            <RequirAuthRoute> <Setting /></RequirAuthRoute>
          } />
          <Route path="/turnReport" element={
            <RequirAuthRoute> <TurnReport /></RequirAuthRoute>
          } />
          <Route path="/report/:id" element={
            <RequirAuthRoute><EquipDetail /></RequirAuthRoute>} />

          <Route path="/equipInfo/:id" element={
            <RequirAuthRoute><UserInfoCard isMobile /></RequirAuthRoute>
          } />
          <Route path="/record" element={<RecordForm />} />
          <Route path="/userInfo_editing" element={
            <RequirAuthRoute><EditingUser /></RequirAuthRoute> } />
        </Routes>
      </Suspense>
    </HashRouter>


  );
}

export default App;
