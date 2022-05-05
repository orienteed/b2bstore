import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './courseSlider.css';
import { shape, string } from 'prop-types';

const CourseSlider = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.testClass}>
            <p>Course slider here!!</p>
        </div>
    );
};

CourseSlider.propTypes = {
    classes: shape({
        testClass: string
    }),
    contentType: string,
    appearance: string
};

export default CourseSlider;
