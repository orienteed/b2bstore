import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    Redirect
} from 'react-router-dom';

import { useLearningRoute } from '../../talons/useLearningRoute';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import CourseContent from '../CourseContent';
import CoursesCatalog from '../CoursesCatalog';

const LearningRoute = () => {
    const [{ isSignedIn }] = useUserContext();
    if (!isSignedIn) {
        return <Redirect to={'/'} />;
    }

    const talonProps = useLearningRoute();
    const {
        userMoodleId,
        userMoodleToken,
        buttonSelected,
        setSelectedButton,
        courses,
        userCourses,
        userCoursesIdList
    } = talonProps;

    return (
        <Router>
            <Switch>
                <Route path="/learning">
                    <CoursesCatalog
                        buttonSelected={buttonSelected}
                        setSelectedButton={setSelectedButton}
                        courses={courses}
                        userCourses={userCourses}
                        userCoursesIdList={userCoursesIdList}
                    />
                </Route>
                <Route path="/course/:courseId">
                    <CourseMiddleware
                        userMoodleId={userMoodleId}
                        userMoodleToken={userMoodleToken}
                        userCoursesIdList={userCoursesIdList}
                    />
                </Route>
            </Switch>
        </Router>
    );
};

const CourseMiddleware = props => {
    const { userMoodleId, userMoodleToken, userCoursesIdList } = props;
    const { courseId } = useParams();
    return (
        <CourseContent
            courseId={courseId}
            userMoodleId={userMoodleId}
            userMoodleToken={userMoodleToken}
            userCoursesIdList={userCoursesIdList}
        />
    );
};

export default LearningRoute;
