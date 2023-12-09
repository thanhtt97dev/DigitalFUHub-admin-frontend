import { apiPostAuth } from '../defaultApi';

export const getFeedbackBenefits = (data) => {
    return apiPostAuth(`api/feedbackBenefits/getFeedbackBenefits`, data);
};

export const addNewFeedbackBenefit = (data) => {
    return apiPostAuth(`api/feedbackBenefits/addNewFeedbackBenefit`, data);
};