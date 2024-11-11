import { LOGIN_USER, OPEN_CV } from "../action/userAppStorage";
import { GENERATE_CV, FETCH_CVS, UPDATE_USER, UPDATE_CV } from "../action/userAppStorage";

const initialState = {
    userToken: '',
    user: null,
    cv: null,
    isCvAvailable: false,
    cvs: []
}

export const userAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                user: action.payload.user,
                userToken: action.payload.userToken,
            }
        case GENERATE_CV:
            return {
                ...state,
                cv: action.payload.cv,
                cvs: [...state.cvs, action.payload.cv],
                isCvAvailable: true
            }

        case OPEN_CV:
            return {
                ...state,
                cv: action.payload,
                isCvAvailable: true
            }

        case FETCH_CVS:
            return {
                ...state,
                cvs: [...state.cvs, action.payload],

            }

        case UPDATE_USER:
            return {
                ...state,
                user: action.payload
            }

        case UPDATE_CV:
            return {
                ...state,

            }
        case UPDATE_CV:
            return {
                ...state,
                cvs: state.cvs.map(cv =>
                    cv.id === action.payload.id ? { ...cv, ...action.payload.data } : cv
                ),
            };


        default:
            return state
    }

}

