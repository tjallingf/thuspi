import { Route, Routes } from 'react-router-dom';
import TestColors from '../pages/TestColors';

const Test = () => {
    console.log('a');

    return (
        <Routes>
            <Route path="/colors" element={<TestColors />} />
        </Routes>
    )
}

export default Test;