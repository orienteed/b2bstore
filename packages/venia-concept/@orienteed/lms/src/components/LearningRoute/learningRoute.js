import React from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import CourseContent from '../CourseContent';
import CoursesCatalog from '../CoursesCatalog';

const LearningRoute = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/learning">
                    <CoursesCatalog />
                </Route>
                <Route exact path="/course/:courseId">
                    <CourseMiddleware />
                </Route>
            </Switch>
        </Router>
    );
};

const CourseMiddleware = () => {
    const { courseId } = useParams();
    return <CourseContent courseId={courseId} />;
};

export default LearningRoute;
