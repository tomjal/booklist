import { BEGIN_FILTER_CHANGE, TOGGLE_PENDING_SUBJECT, END_FILTER_CHANGE, SET_FILTERS, SET_PENDING, SET_VIEWING_USERID } from './actionNames';

import { subjectsSelector } from '../subjects/reducer';
import { booksSelector } from '../books/reducer';

const searchFields = {
    search: '',
    subjects: {},
    searchChildSubjects: false,
    author: '',
    publisher: '',
    pages: '',
    pagesOperator: '>'
}

const initialState = {
    sort: '',
    sortDirection: '',
    editingFilters: false,
    ...searchFields,
    pending: {
        ...searchFields
    }
};

export function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_FILTERS:
            let newSearchFields = {};
            Object.keys(searchFields).forEach(k => newSearchFields[k] = action[k]);
            return { ...state, ...action.packet, pending: { ...action.packet } };
        case SET_PENDING:
            return { ...state, pending: { ...state.pending, [action.field]: action.value } };
        case BEGIN_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: true, pendingSubjects: { ...state.subjects } });
        case TOGGLE_PENDING_SUBJECT:
            return Object.assign({}, state, { pending: { ...state.pending, subjects: { ...state.pending.subjects, [action._id]: !state.pending.subjects[action._id] } } });
        case END_FILTER_CHANGE:
            return Object.assign({}, state, { editingFilters: false });
    }
    return state;
}

function projectselectedSubjects(selectedSubjectsIds, subjects){
    //last filter since subjects might not be loaded yet
    return Object.keys(selectedSubjectsIds).filter(k => selectedSubjectsIds[k]).map(_id => subjects[_id]).filter(s => s);
}

export const bookSearchSelector = state => {
    let books = state.books,
        root = state.root;

    let subjectsState = subjectsSelector(books);
    let booksState = booksSelector(books);

    return Object.assign({},
        books.bookSearch,
        {
            selectedSubjects: projectselectedSubjects(books.bookSearch.subjects, books.subjects.subjectHash),
            ...books.ui,
            subjects: subjectsState.subjects,
            selectedBooksCount: booksState.selectedBooksCount,
            viewingPublic: root.isPublic
        });
}