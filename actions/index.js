// @flow

import fetch from 'isomorphic-fetch';
import invariant from 'invariant';

import {getErrorType, getSuccessType} from '../utils/actionTypes';
import graphql from '../utils/graphql';

import ActionTypes from '../constants/ActionTypes';

export function makeRequest(query: string, variables, type: string) {
  invariant(
    query && type,
    'Your request must include a query and an action type.'
  );

  return (dispatch: Function, getState: Function) => {
    dispatch({type});

    const {session: {authToken}} = getState();

    return graphql(query, {authToken, variables})
      .then((data) => dispatch({
        data,
        type: getSuccessType(type),
      }))
      .catch((error) => dispatch({
        error,
        type: getErrorType(type),
      }));
  };
}

export function getGarminActivity(activityId: number): Function {
  return (dispatch: Function) => {
    const type = ActionTypes.GARMIN_ACTIVITY_FETCH;

    dispatch({type});

    const URL = 'https://connect.garmin.com/proxy/activity-service/activity/';

    fetch(`${URL}${activityId}`, {
      headers: {
        // 'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'text/plain',
      },
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch({
          data,
          type: getSuccessType(type),
        });
      })
      .catch((error) => {
        dispatch({
          error,
          type: getErrorType(type),
        });
      });
  };
}

export const initializeSession = (session) => ({
  type: ActionTypes.SESSION_INITIALIZE_SUCCESS,
  session,
});

export function toggleSideNav(): Function {
  return (dispatch: Function, getState: Function) => {
    const sideNavOpen = !getState().navigation.sideNavOpen;
    localStorage && localStorage.setItem('sideNavOpen', sideNavOpen);
    dispatch({
      sideNavOpen,
      type: ActionTypes.NAV_TOGGLE,
    });
  };
}

export function hideActivityModal(): Function {
  return (dispatch) => dispatch({type: ActionTypes.ACTIVITY_MODAL_HIDE});
}

