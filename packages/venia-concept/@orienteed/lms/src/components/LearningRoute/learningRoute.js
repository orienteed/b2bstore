import React from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';

import { useLearningRoute } from '../../talons/useLearningRoute';

import CourseContent from '../CourseContent';
import CoursesCatalog from '../CoursesCatalog';

const LearningRoute = () => {
    const talonProps = useLearningRoute();
    const {
        userMoodleId,
        userMoodleToken,
        buttonSelected,
        setSelectedButton,
        courses,
        userCourses,
        userCoursesIdList,
        setUserCoursesIdList
    } = talonProps;

    return (
        <Router>
            <Switch>
                <Route path="/:lang*/learning">
                    <CoursesCatalog
                        buttonSelected={buttonSelected}
                        setSelectedButton={setSelectedButton}
                        courses={courses}
                        userCourses={userCourses}
                        userCoursesIdList={userCoursesIdList}
                    />
                </Route>
                <Route path="/:lang*/course/:courseId">
                    <CourseMiddleware
                        userMoodleId={userMoodleId}
                        userMoodleToken={userMoodleToken}
                        userCoursesIdList={userCoursesIdList}
                        setUserCoursesIdList={setUserCoursesIdList}
                    />
                </Route>
            </Switch>
        </Router>
    );
};

const CourseMiddleware = props => {
    const { userMoodleId, userMoodleToken, userCoursesIdList, setUserCoursesIdList } = props;
    const { courseId } = useParams();
    return (
        <CourseContent
            courseId={courseId}
            userMoodleId={userMoodleId}
            userMoodleToken={userMoodleToken}
            userCoursesIdList={userCoursesIdList}
            setUserCoursesIdList={setUserCoursesIdList}
        />
    );
};

export default LearningRoute;
