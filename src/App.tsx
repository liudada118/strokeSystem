import React, { Suspense } from 'react';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Loading } from './components/pageLoading';
import RequirAuthRoute from './components/auth/RequirAuthRoute';
import Question from './pages/question/Question';

import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs'
import { UAParser } from 'ua-parser-js'

const getHashPriorty = () => {
  let ua: any = UAParser(navigator.userAgent)

  const { browser } = ua

  let major = browser.version.split('.')[0] - 0
  if (browser.name === 'Chrome' && major > 88) {
    return 'low'
  } else if (browser.name === 'Firefox' && major > 78) {
    return 'low'
  } else if (browser.name === 'Safari' && major > 14) {
    return 'low'
  } else {
    return 'high'
  }


}

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
      <StyleProvider
        hashPriority={getHashPriorty()}
        transformers={[legacyLogicalPropertiesTransformer]}
      >
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
            <Route path="/report/:type/:id" element={
              <RequirAuthRoute><EquipDetail /></RequirAuthRoute>} />

            <Route path="/equipInfo/:id" element={
              <RequirAuthRoute><UserInfoCard isMobile /></RequirAuthRoute>
            } />

            <Route path="/que" element={
              <RequirAuthRoute>  <Question /></RequirAuthRoute>
            }
            />

            <Route path="/record" element={<RecordForm />} />
            <Route path="/userInfo_editing" element={
              <RequirAuthRoute><EditingUser /></RequirAuthRoute>} />
          </Routes>
        </Suspense>
      </StyleProvider>
    </HashRouter>


  );
}

export default App;
